// import { html, render } from "../../node_modules/";
import { html, render } from 'https://esm.run/lit-html@1';
import { appLayout } from './common/appLayout.js';

const root = document.querySelector(".app");

const homeTemplate = () =>
    html`
    <header class="home-header">
        <h2>Home</h2>
    </header>
    <section class="bento">
        <article class="budgets">Budgets</article>
        <article class="line-graph">Line graph</article>
        <article class="transaction-list">Transaction list</article>
    </section>`;

export async function homePage() {
    render(appLayout(homeTemplate()), root);
}