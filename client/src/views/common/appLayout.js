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
        <aside class="app-layout__sidebar">
            <p class="app-layout__username">${username}</p>
            <nav class="app-layout__nav">
                <button 
                @click=${() => navigate("/")} 
                class="app-layout__nav-link ${currentPath === "/" ? "app-layout__nav-link--active" : ""}">
                <i class="fa-solid fa-home app__nav-icon"></i>
                Home
                </button>
                <button 
                    @click=${() => navigate("/transactions")} 
                    class="app-layout__nav-link ${currentPath === "/transactions" ? "app-layout__nav-link--active" : ""}">
                <i class="fa-solid fa-list app__nav-icon"></i>
                Transactions
                </button>
                <button 
                    @click=${() => navigate("/calendar")} 
                    class="app-layout__nav-link ${currentPath === "/calendar" ? "app-layout__nav-link--active" : ""}">
                <i class="fa-solid fa-calendar app__nav-icon"></i>
                Calendar
                </button>
                <button @click=${onLogoutClick} class="app-layout__nav-link">
                <i class="fa-solid fa-right-from-bracket app__nav-icon"></i>
                Logout
                </button>
            </nav>
        </aside>

        <main class="app-layout__main">
            ${content}
            ${currentPath !== "/transactions/add" && !currentPath.startsWith("/transactions/edit/") ? html`<button @click=${onAddTransaction} class="app-layout__fab" title="Add Transaction">+</button>` : ""} 
        </main>

        ${logoutModalOpen
        ? modalTemplate({ message, onConfirm, onCancel })
        : ""}
    </div>
`;