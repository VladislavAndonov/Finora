import "../../../styles/layout.css"

import { html } from 'lit-html';

import { modalTemplate } from './modal.js';
import { navigate } from '../../utils/navigation.js';

export const appLayout = ({
    content,
    username,
    currentPath,
    logoutModalOpen,
    message,
    onLogoutClick,
    onConfirm,
    onCancel,
    onAddTransaction
}) => html`
    <div class="app-layout">
        <aside class="app-layout-sidebar">
            <p class="app-layout-username">${username}</p>
            <nav class="app-layout-nav">
                <a @click=${() => navigate("/")}  class="app-layout-nav-link ${currentPath === "/" ? "app-layout-nav-link-active" : ""}">Home</a>
                <a @click=${() => navigate("/transactions")}  class="app-layout-nav-link ${currentPath === "/transactions" ? "app-layout-nav-link-active" : ""}">Transactions</a>
                <a @click=${() => navigate("/calendar")}  class="app-layout-nav-link ${currentPath === "/calendar" ? "app-layout-nav-link-active" : ""}">Calendar</a>
                <a @click=${onLogoutClick} class="app-layout-nav-link">Logout</a>
            </nav>
        </aside>

        <main class="app-layout-main">
            ${content}
            ${currentPath !== "/transactions/add" && !currentPath.startsWith("/transactions/edit/") ? html`<button @click=${onAddTransaction} class="app-layout-fab" title="Add Transaction">+</button>` : ""} 
        </main>

        ${logoutModalOpen
        ? modalTemplate({ message, onConfirm, onCancel })
        : ""}
    </div>
`;