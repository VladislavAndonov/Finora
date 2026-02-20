import page from "page";
import { html, render } from "lit-html";

import { logout } from "../api/api.js";
import { appLayout } from '../views/common/appLayout.js';
import { modalTemplate } from "../views/common/modal.js";

const root = document.querySelector(".app");

const uiState = {
    renderApp: null,
    activeView: null,
    activeModal: null
}

export function withAppShell(ctx, next) {
    const username = sessionStorage.getItem("username");
    const currentPath = ctx.path;

    ctx.render = (viewContent) => {
        uiState.activeView = viewContent;

        uiState.renderApp = () => {
            render(appLayout({
                content: uiState.activeView,
                username,
                currentPath,
                onLogoutClick,
                onAddTransaction,
                modal: uiState.activeModal ? modalTemplate(uiState.activeModal) : null
            }), root);
        }

        uiState.renderApp();
    }
    next();
}

export function withoutShell(ctx, next) {
    ctx.render = (content) => {
        render(content, root);
    }
    next();
}

function logoutModalContent() {
    return html`
        <p class="modal__message">Are you sure you want to logout?</p>
            <div class="modal__actions">
                <button class="modal__btn modal__btn--primary" @click=${onConfirmLogout}>Confirm</button>
                <button class="modal__btn modal__btn--secondary" @click=${onCancelLogout}>Cancel</button>
            </div>
        `;
}

function onLogoutClick() {
    uiState.activeModal = {
        content: logoutModalContent(),
        onClose: onCancelLogout
    };

    document.addEventListener('keydown', handleEscKey);

    uiState.renderApp();
}

function onCancelLogout() {
    uiState.activeModal = null;

    document.removeEventListener('keydown', handleEscKey);

    uiState.renderApp();
}

async function onConfirmLogout() {
    try {
        await logout();
        page.redirect("/auth/login");
    } catch {
        console.log("Logout failed. Please try again");
    } finally {
        uiState.activeModal = null;
        uiState.renderApp();
    }
}

function handleEscKey(e) {
    if (e.key === 'Escape') {
        onCancelLogout();
    }
}

function onAddTransaction() {
    page("/transactions/add")
}