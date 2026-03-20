import page from "page";
import { render } from "lit-html";

import { logout } from "../api/api.js";
import { appLayout } from '../views/common/appLayout.js';

const root = document.querySelector(".app");

const uiState = {
    renderApp: null,
    activeView: null,
    logoutModalOpen: false,
    profileDropdownOpen: false // Add this
}

export function withAppShell(ctx, next) {
    const email = sessionStorage.getItem("email")
    const username = sessionStorage.getItem("username");
    const currentPath = ctx.path;

    ctx.render = (viewContent) => {
        uiState.activeView = viewContent;

        uiState.renderApp = () => {
            render(appLayout({
                content: uiState.activeView,
                email,
                username,
                currentPath,
                logoutModalOpen: uiState.logoutModalOpen,
                profileDropdownOpen: uiState.profileDropdownOpen,
                onLogoutClick,
                onConfirmLogout,
                onCancelLogout,
                onAddTransaction,
                onToggleProfileDropdown
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

function onToggleProfileDropdown() {
    uiState.profileDropdownOpen = !uiState.profileDropdownOpen;
    uiState.renderApp();
}

function onLogoutClick() {
    uiState.logoutModalOpen = true;
    uiState.profileDropdownOpen = false;

    document.addEventListener('keydown', handleEscKey);

    uiState.renderApp();
}

function onCancelLogout() {
    uiState.logoutModalOpen = false;

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
        uiState.logoutModalOpen = false;
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