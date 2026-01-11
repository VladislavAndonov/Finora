import { html } from 'https://esm.run/lit-html@1';

export const homeView = (ctx) =>
    ctx.render(html`
    <header class="home-header">
        <h2>Home</h2>
    </header>
    <section class="bento">
        <article class="budgets">Budgets</article>
        <article class="line-graph">Line graph</article>
        <article class="transaction-list">Transaction list</article>
    </section>
`);
