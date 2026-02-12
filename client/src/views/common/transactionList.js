import { html } from "lit-html";

import { navigate } from '../../utils/navigation.js';

export const transactionList = (filters, transactions) =>
    html`
        <div class="transaction-filter">
            ${filters.map((f) => html`
                <div class="transaction-filter-option">
                    <input 
                        class="transaction-filter-input"
                        type="radio" 
                        name="transactions" 
                        .checked=${f.active} 
                        id=${f.label.toLowerCase()} 
                        @change=${f.onClick}
                    />
                    <label class="transaction-filter-label" for=${f.label.toLowerCase()}>${f.label}</label>
                </div>
            `)}
        </div >

        <ul class="transaction-list-items">
            ${transactions.map((trs) => html`
                <li class="transaction-list-item">
                    <a 
                        @click=${() => navigate(`/transactions/edit/${trs._id}`)}>
                        <span>${trs.title}</span>
                        <span>${trs.amount}</span>
                    </a>
                </li>
            `)}
        </ul>`;