import { html } from 'https://esm.run/lit-html@1';
import { navigate } from '../../utils/navigation.js';

export const transactionList = (filters, transactions) =>
    html`
        <div class="toggle-radio">
            ${filters.map((f) => html`<input type="radio" name="transactions" .checked=${f.active} id=${f.label.toLowerCase()} @change=${f.onClick}>
                                    <label for=${f.label.toLowerCase()}>${f.label}</label>`)}
        </div >
        <ul>
            ${transactions.length ? transactions.map((trs) => html`<li><a class="transaction" @click=${() => navigate(`/transactions/edit/${trs._id}`)}>${trs.title}, ${trs.amount}</a></li>`) : html``}
        </ul>`;