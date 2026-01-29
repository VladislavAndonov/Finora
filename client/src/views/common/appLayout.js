import { html } from 'https://esm.run/lit-html@1';
import { modalTemplate } from './modal.js';

export const appLayout = (
    content,
    username,
    currentPath,
    logoutModalOpen,
    onLogoutClick,
    onConfirmLogout,
    onCancelLogout,
    onAddTransaction
) => html`
    <div class="container">
        <aside class="sidebar">
            <p class="username">${username}</p>
            <nav class="main-nav">
                <a href="/" class=${currentPath === "/" ? "active" : ""}>Home</a>
                <a href="/transactions" class=${currentPath === "/transactions" ? "active" : ""}>Transactions</a>
                <a href="/calendar" class=${currentPath === "/calendar" ? "active" : ""}>Calendar</a>
                <a @click=${onLogoutClick}>Logout</a>
            </nav>
        </aside>

        <main class="main-content">
            ${content}
            ${currentPath !== "/transactions/add" && !currentPath.startsWith("/transactions/edit/") ? html`<button @click=${onAddTransaction} class="add-transaction-btn" title="Add Transaction">+</button>` : ""} 
        </main>

        ${logoutModalOpen
        ? modalTemplate(onConfirmLogout, onCancelLogout)
        : ""}
    </div>
`;