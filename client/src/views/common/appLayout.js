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
    onAddTransaction,
    profileDropdownOpen,
    onToggleProfileDropdown,
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
                    <a href="/" @click=${navigate}
                        class="app-layout__nav-link ${currentPath === "/" ? "app-layout__nav-link--active" : ""}">
                        <i class="ph ph-house app-layout__icon"></i>
                        Home
                    </a>
                    <a href="/transactions" @click=${navigate}
                        class="app-layout__nav-link ${currentPath === "/transactions" ? "app-layout__nav-link--active" : ""}">
                        <i class="ph ph-list-bullets app-layout__icon"></i>
                        Transactions
                    </a>
                    <a href="/calendar" @click=${navigate}
                        class="app-layout__nav-link ${currentPath === "/calendar" ? "app-layout__nav-link--active" : ""}">
                        <i class="ph ph-calendar-blank app-layout__icon"></i>
                        Calendar
                    </a>

                    <div class="app-layout__logout">
                        <div class="app-layout__divider"></div>
                        <button @click=${onLogoutClick} class="app-layout__nav-link">
                            <i class="ph ph-sign-out app-layout__icon"></i>
                            Sign Out
                        </button>
                    </div>
                </nav>
            </aside>

            <main class="app-layout__main">
                <div class="app-layout__content-wrapper">
                    ${content}
                    ${showFab ? html`
                        <button @click=${onAddTransaction} class="app-layout__fab" title="Add Transaction">
                            <i class="ph-bold ph-plus"></i>
                        </button>
                    ` : ""}
                </div>
            </main>

            <!-- Mobile bottom navigation -->
            <nav class="app-layout__mobile-nav">
                <a href="/" @click=${navigate}
                    class="app-layout__mobile-nav-link ${currentPath === "/" ? "app-layout__mobile-nav-link--active" : ""}">
                    <i class="${currentPath === "/" ? "ph-fill" : "ph"} ph-house app-layout__mobile-nav-icon"></i>
                    <span class="app-layout__mobile-nav-label">Home</span>
                </a>
                <a href="/transactions" @click=${navigate}
                    class="app-layout__mobile-nav-link ${currentPath === "/transactions" ? "app-layout__mobile-nav-link--active" : ""}">
                    <i class="${currentPath === "/transactions" ? "ph-bold" : "ph"} ph-list-bullets app-layout__mobile-nav-icon"></i>
                    <span class="app-layout__mobile-nav-label">Transactions</span>
                </a>

                <a href="/transactions/add" @click=${navigate}
                    class="app-layout__mobile-nav-link ${currentPath === "/transactions/add" ? "app-layout__mobile-nav-link--active" : ""}">
                    <i class="${currentPath === "/transactions/add" ? "ph-fill" : "ph"} ph-plus-circle app-layout__mobile-nav-icon"></i>
                    <span class="app-layout__mobile-nav-label">Add</span>
                </a>

                <a href="/calendar" @click=${navigate}
                    class="app-layout__mobile-nav-link ${currentPath === "/calendar" ? "app-layout__mobile-nav-link--active" : ""}">
                    <i class="${currentPath === "/calendar" ? "ph-fill" : "ph"} ph-calendar-blank app-layout__mobile-nav-icon"></i>
                    <span class="app-layout__mobile-nav-label">Calendar</span>
                </a>

                <button @click=${onToggleProfileDropdown}
                    class="app-layout__mobile-nav-link">
                    <i class="ph ph-user app-layout__mobile-nav-icon"></i>
                    <span class="app-layout__mobile-nav-label">Profile</span>
                </button>
            </nav>

            <!-- Profile dropdown (mobile) -->
            ${profileDropdownOpen ? html`
                <div class="app-layout__dropdown-backdrop" @click=${onToggleProfileDropdown}></div>
                <div class="app-layout__profile-dropdown">
                    <div class="app-layout__profile">
                        <div class="app-layout__avatar">#</div>
                        <div class="app-layout__profile-info">
                            <span class="app-layout__username">${username}</span>
                            <span class="app-layout__email">${email}</span>
                        </div>
                    </div>
                    <div class="app-layout__divider"></div>
                    <button class="app-layout__dropdown-logout" @click=${onLogoutClick}>
                        <i class="ph ph-sign-out"></i>
                        Sign Out
                    </button>
                </div>
            ` : ""}

            ${logoutModalOpen ? modalTemplate({ onConfirmLogout, onCancelLogout }) : ""}
        </div>
    `;
}