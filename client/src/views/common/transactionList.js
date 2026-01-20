import { html } from 'https://esm.run/lit-html@1';

export const transactionList = (transactions) =>
    html`
        <ul>
            ${transactions.length ? transactions.map((trs) => html`<li>${trs.title}, ${trs.amount}</li>`) : html``}
        </ul>`;