import "../../../styles/transactionList.css"


import { html } from "lit-html";

import { navigate } from '../../utils/navigation.js';
import { categoriesMasterList } from "../../utils/categoryList.js";

export const transactionList = (filters, transactionsByDate, noTransactionsMessage) =>
    html`
        <div class="transaction-list">
            <div class="transaction-list__filters">
                ${filters.map((f) => html`
                    <div class="transaction-list__filter">
                        <input class="transaction-list__radio" type="radio" .checked=${f.active} id="${f.label.toLowerCase()}" @change=${f.onClick}/>
                        <label class="transaction-list__label" for="${f.label.toLowerCase()}">
                            ${f.label === "Income" ? html `<i class="transaction-list__icon ph-fill ph-caret-up"></i>`  : f.label === "Expenses" ? html `<i class="transaction-list__icon ph-fill ph-caret-down"></i>` : null}
                            ${f.label}
                        </label>
                    </div>
                `)}
            </div >

    <div class="transaction-list__content">
        ${Object.entries(transactionsByDate).length !== 0 ? Object.entries(transactionsByDate).map(([date, transactions]) => html`
                    <div class="transaction-list__group">
                        <span class="transaction-list__date">${date}</span>
                        <ul class="transaction-list__items">
                            ${transactions.map((txn) => html`
                                <li class="transaction-list__item">
                                    <a href="/transactions/edit/${txn._id}" class="transaction-list__link" @click=${navigate}>
                                        <div class="transaction-list__info">
                                            <span class="transaction-list__title">${txn.title}</span>
                                            <span class="transaction-list__category" style="--category-color: ${getCategoryColor(txn.category, txn.type)}">${txn.category}</span>
                                        </div>
                                        <span class="transaction-list__amount transaction-list__amount--${txn.type === "expenses" ? "negative" : "positive"}">
                                            <i class="transaction-list__icon ${txn.type === "expenses" ? "ph-fill ph-caret-down" : "ph-fill ph-caret-up"}"></i>
                                            $${txn.amount % 1 === 0 ? txn.amount : Number(txn.amount).toFixed(2)}
                                        </span>
                                    </a >
                                </li >
    `)}
                        </ul>
                    </div>
                `) : html`<p class="transaction-list__empty-message">${noTransactionsMessage}</p>`}

    </div >
        </div >
    `;


function getCategoryColor(txnCategory, txnType) {
    const category = categoriesMasterList.find(c =>
        c.name === txnCategory &&
        c.type === txnType
    );

    return category?.color ?? "#aaa"
}