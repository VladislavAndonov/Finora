import page from "//unpkg.com/page/page.mjs";
import { render } from 'https://esm.run/lit-html@1';

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

    ctx.render = (content) => {
        uiState.activeView = content;

        uiState.renderApp = () => {
            render(appLayout(
                uiState.activeView,
                username,
                currentPath,
                uiState.logoutModalOpen,
                onLogoutClick,
                onConfirmLogout,
                onCancelLogout,
                onAddTransaction
            ), root);
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