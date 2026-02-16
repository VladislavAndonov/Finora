import "../../../styles/transactionList.css"


import { html } from "lit-html";

import { navigate } from '../../utils/navigation.js';

export const transactionList = (filters, transactions) =>
    html`
        <div class="transaction-list">
            <div class="transaction-list__filters">
                ${filters.map((f) => html`
                    <div class="transaction-list__filter">
                        <input class="transaction-list__radio" type="radio" .checked=${f.active} id="${f.label.toLowerCase()}" @change=${f.onClick}/>
                        <label class="transaction-list__label" for="${f.label.toLowerCase()}">${f.label}</label>
                    </div>
                `)}
            </div >

            <ul class="transaction-list__items">
                ${transactions.map((trs) => html`
                    <li class="transaction-list__item">
                        <button class="transaction-list__link" @click=${() => navigate(`/transactions/edit/${trs._id}`)}>
                            <div class="transaction-list__info">
                                <span class="transaction-list__title">${trs.title}</span>
                                <span class="transaction-list__category">${trs.category}</span>
                            </div>
                            <span class="transaction-list__amount transaction-list__amount--${trs.type === "expenses" ? "negative" : "positive"}">€${trs.amount}</span>
                        </button>
                    </li>
                `)}
            </ul>
        </div>
    `;