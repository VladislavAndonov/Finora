import page from "page";
import { render } from "lit-html";

import { appLayout } from '../views/common/appLayout.js';
import { logout } from "../api/api.js";

const root = document.querySelector(".app");

const uiState = {
    renderApp: null,
    activeView: null,
    logoutModalOpen: false
}

export function withAppShell(ctx, next) {
    const username = sessionStorage.getItem("username");
    const currentPath = ctx.path;
    const logoutMessage = "Are you sure you want to log out?"

    ctx.render = (content) => {
        uiState.activeView = content;

        uiState.renderApp = () => {
            render(appLayout({
                content: uiState.activeView,
                username,
                currentPath,
                logoutModalOpen: uiState.logoutModalOpen,
                message: logoutMessage,
                onLogoutClick,
                onConfirm: onConfirmLogout,
                onCancel: onCancelLogout,
                onAddTransaction
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

async function onConfirmLogout() {
    try {
        await logout();
        page.redirect("/auth/login");
    } catch {
        console.log("Logout failed. Please try again");
    } finally {
        uiState.logoutModalOpen = false;
        uiState.renderApp();
    }
}

function onCancelLogout() {
    uiState.logoutModalOpen = false;
    uiState.renderApp();
}

function onLogoutClick() {
    uiState.logoutModalOpen = true;
    uiState.renderApp();
}

function onAddTransaction() {
    page.redirect("/transactions/add")
}