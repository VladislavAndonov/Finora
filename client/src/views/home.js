import { html } from 'https://esm.run/lit-html@1';
import { getTransactions } from '../api/data.js';
import { transactionList } from './common/transactionList.js';

const queryOptions = { limit: 10 }

const homeTemplate = ({ filters, transactions }) =>
    html`
    <header class="home-header">
        <h2>Home</h2>
    </header>
    <div class="bento">
        <section class="budgets"></section>
        <section class="line-graph"></section>
        <section class="transaction-list">
            ${transactionList(filters, transactions)}
        </section >
    </div >`;


export async function homeView(ctx) {
    let transactions = await getTransactions({}, queryOptions);

    const showAllTransactions = async () => {
        transactions = await getTransactions({}, queryOptions);
        setActive("All");
        update();
    };
    const showExpenses = async () => {
        transactions = await getTransactions({ type: "expenses" }, queryOptions);
        setActive("Expenses");
        update();
    };
    const showIncome = async () => {
        transactions = await getTransactions({ type: "income" }, queryOptions);
        setActive("Income");
        update();
    };

    const filters = [
        { label: "All", onClick: showAllTransactions, active: true },
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

    const update = () => {
        ctx.render(homeTemplate({ filters, transactions }));
    }

    update()
}