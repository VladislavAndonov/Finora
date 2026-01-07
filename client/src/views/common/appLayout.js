import { html } from 'https://esm.run/lit-html@1';


const sidebar = () =>
    html`
    <aside class=sidebar>
        <p class="profile-name">John Doe</p>
        <ul class="main-nav">
            <li><a class="homeLink current" href="/">Home</a></li>
            <li><a class="expensesLink" href="/expenses">Expenses</a></li>
            <li><a class="incomeLink" href="/income">Income</a></li>
            <li><a class="calendarLink" href="/calendar">Calendar</a></li>
            <li><a class="logoutBtn" href="/logout">Logout</a></li>
        </ul>
    </aside>`;


export const appLayout = (content) => html`
<div class="container">
    ${sidebar()}
    <main class="main-content">
        ${content}
    </main>
</div>`;


