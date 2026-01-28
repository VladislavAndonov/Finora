import { html } from 'https://esm.run/lit-html@1';

export const transactionList = (filters, transactions) =>
    html`
        <div class="toggle-radio">
            ${filters.map((f) => html`<input type="radio" name="transactions" .checked=${f.active} id=${f.label.toLowerCase()} @change=${f.onClick}>
                                    <label for=${f.label.toLowerCase()}>${f.label}</label>`)}
        </div >
        <ul>
            ${transactions.length ? transactions.map((trs) => html`<li>${trs.title}, ${trs.amount}</li>`) : html``}
        </ul>`;