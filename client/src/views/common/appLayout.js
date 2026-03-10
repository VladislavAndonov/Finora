import "../../../styles/layout.css"

import { html } from 'lit-html';

import { navigate } from '../../utils/navigation.js';
import { modalTemplate } from "./logoutModal.js";

export const appLayout = ({
    content,
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
                <p class="app-layout__username">${username}</p>
                <nav class="app-layout__nav">
                    <a 
                    href="/"
                    @click=${navigate}
                    class="app-layout__nav-link ${currentPath === "/" ? "app-layout__nav-link--active" : ""}">
                    <i class="fa-solid fa-home app__nav-icon"></i>
                    Home
                    </a>
                    <a
                        href="/transactions"
                        @click=${navigate} 
                        class="app-layout__nav-link ${currentPath === "/transactions" ? "app-layout__nav-link--active" : ""}">
                    <i class="fa-solid fa-list app__nav-icon"></i>
                    Transactions
                    </a>
                    <a 
                        href="/calendar"
                        @click=${navigate} 
                        class="app-layout__nav-link ${currentPath === "/calendar" ? "app-layout__nav-link--active" : ""}">
                    <i class="fa-regular fa-calendar-days app__nav-icon"></i>
                    Calendar
                    </a>
                    <button @click=${onLogoutClick} class="app-layout__nav-link">
                    <i class="fa-solid fa-right-from-bracket app__nav-icon"></i>
                    Logout
                    </button>
                </nav>
            </aside>

            <main class="app-layout__main">
                ${content}
                ${showFab ? html`<button @click=${onAddTransaction} class="app-layout__fab" title="Add Transaction">+</button>` : ""} 
            </main>

            ${logoutModalOpen
            ? modalTemplate({ onConfirmLogout, onCancelLogout })
            : ""}
        </div>
    `;
}