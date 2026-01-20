import { html } from 'https://esm.run/lit-html@1';
import { getTransactions } from '../api/data.js';
import { transactionList } from './common/transactionList.js';

const queryOptions = { limit: 10 }

const homeTemplate = (filters, transactions) =>
    html`
    <header class="home-header">
        <h2>Home</h2>
    </header>
    <section class="bento">
        <article class="budgets"></article>
        <article class="line-graph"></article>
        <article class="transaction-list">
            <div class="toggle-radio">
                ${filters.map((f) => html`<input type="radio" name="transactions" .checked=${f.active} id=${f.label.toLowerCase()} @change=${f.onClick}>
                                        <label for=${f.label.toLowerCase()}>${f.label}</label>`)}
            </div >
        ${transactionList(transactions)}
        </article >
    </section >
    `;


export async function homeView(ctx) {
    let transactions = await getTransactions({}, queryOptions);

    const showAll = async () => {
        transactions = await getTransactions({}, queryOptions);
        setActive("All");
        updateTransactions(transactions);
    };
    const showExpenses = async () => {
        transactions = await getTransactions({ type: "expenses" }, queryOptions);
        setActive("Expenses");
        updateTransactions(transactions);
    };
    const showIncome = async () => {
        transactions = await getTransactions({ type: "income" }, queryOptions);
        setActive("Income");
        updateTransactions(transactions);
    };

    const filters = [
        { label: "All", onClick: showAll, active: true },
        { label: "Expenses", onClick: showExpenses, active: false },
        { label: "Income", onClick: showIncome, active: false }
    ];

    const setActive = (label) => {
        filters.forEach(f => {
            if (f.label === label) {
                f.active = true;
            } else {
                f.active = false;
            }
        });
    };

    const updateTransactions = (trs) => {
        ctx.render(homeTemplate(filters, trs));
    }

    ctx.render(homeTemplate(filters, transactions));
}