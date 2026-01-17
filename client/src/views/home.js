import { html } from 'https://esm.run/lit-html@1';
import { getLatestTransactions } from '../api/data.js';

const homeTemplate = (transactions) =>
    html`
    <header class="home-header">
        <h2>Home</h2>
    </header>
    <section class="bento">
        <article class="budgets">Budgets</article>
        <article class="line-graph">Line graph</article>
        <article class="transaction-list">Transaction list:
        <ul>
            ${transactions.length ? transactions.map((trs) => html`<li>${trs.title}, ${trs.amount}</li>`) : html`<li>Your transactions will appear here</li>`}
        </ul>
        </article>
    </section>
`;

export async function homeView(ctx) {
    const transactions = await getLatestTransactions();

    if (!transactions) {
        return
    }

    ctx.render(homeTemplate(transactions))
}