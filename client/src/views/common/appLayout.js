import "../../../styles/layout.css"

import { html } from 'lit-html';

import { navigate } from '../../utils/navigation.js';
import { modalTemplate } from "./logoutModal.js";

export const appLayout = ({
    content,
    email,
    username,
    currentPath,
    onLogoutClick,
    logoutModalOpen,
    onConfirmLogout,
    onCancelLogout,
    onAddTransaction
}) => {
    const hiddenFabRoutes = ['/add', '/edit/'];
    const showFab = !hiddenFabRoutes.some(route => currentPath.includes(route));

    return html`
        <div class="app-layout">
            <aside class="app-layout__sidebar">

                <div class="app-layout__profile">
                    <div class="app-layout__avatar">#</div>
                    <div class="app-layout__profile-info">
                        <span class="app-layout__username">${username}</span>
                        <span class="app-layout__email">${email}</span>
                    </div>
                </div>

                <div class="app-layout__divider"></div>

                <nav class="app-layout__nav">
                    <a 
                        href="/"
                        @click=${navigate}
                        class="app-layout__nav-link ${currentPath === "/" ? "app-layout__nav-link--active" : ""}">
                        <i class="ph ph-house app-layout__icon"></i>
                        Home
                    </a>
                    <a
                        href="/transactions"
                        @click=${navigate} 
                        class="app-layout__nav-link ${currentPath === "/transactions" ? "app-layout__nav-link--active" : ""}">
                        <i class="ph ph-list-bullets app-layout__icon"></i>
                        Transactions
                    </a>
                    <a 
                        href="/calendar"
                        @click=${navigate} 
                        class="app-layout__nav-link ${currentPath === "/calendar" ? "app-layout__nav-link--active" : ""}">
                        <i class="ph ph-calendar-blank app-layout__icon"></i>
                        Calendar
                    </a>

                    <div class="app-layout__divider"></div>

                    <button @click=${onLogoutClick} class="app-layout__nav-link">
                    <i class="ph ph-sign-out app-layout__icon"></i>
                    Logout
                    </button>
                </nav>
            </aside>

            <main class="app-layout__main">
                ${content}
                ${showFab ? html`
                    <button @click=${onAddTransaction} class="app-layout__fab" title="Add Transaction">
                        <i class="ph-bold ph-plus"></i>
                    </button>
                ` : ""} 
            </main>

            ${logoutModalOpen
            ? modalTemplate({ onConfirmLogout, onCancelLogout })
            : ""}
        </div>
    `;
}