import { html } from 'https://esm.run/lit-html@1';

const navLinks = [
    { label: "Home", path: "/" },
    { label: "Transactions", path: "/transactions" },
    { label: "Calendar", path: "/calendar" },
    { label: "Logout", path: "/auth/logout" },
];

export const appLayout = (content, ctx) => {
    const username = sessionStorage.getItem("username");

    return html`
        <div class="container">
            ${sidebar(ctx.path, username)}
            <main class="main-content">
                ${content}
            </main>
        </div>`;
}

const sidebar = (currPath, username) =>
    html`
    <aside class=sidebar>
        <p class="profile-name">${username}</p>
        <ul class="main-nav">
            ${renderLinks(currPath)}
        </ul>
    </aside>`;


const renderLinks = (currPath) => {
    const links = [];
    navLinks.forEach((link) => links.push(html`<li><a class="${link.label.toLowerCase()}Link ${link.path === currPath ? "selected" : ""}" href="${link.path}">${link.label}</a></li>`));

    return links
};