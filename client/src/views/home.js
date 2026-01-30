import { html } from 'https://esm.run/lit-html@1';
import { getTransactions, getUserBalance } from '../api/data.js';
import { transactionList } from './common/transactionList.js';

const queryOptions = { limit: 10 }

const homeTemplate = ({ filters, transactions, balance }) =>
    html`
    <header class="home-header">
        <h2>Home</h2>
    </header>
    <section class="home-layout">
        <section class="finance-overview">
            <div class="balance">
                Balance: €${balance}
            </div>
            <div class="monthly-goal">
            </div>
        </section>
        <section class="line-graph"></section>
        <section class="transaction-list">
            ${transactionList(filters, transactions)}
        </section >
    </section >`;


export async function homeView(ctx) {
    let transactions = await getTransactions({}, queryOptions);
    const balance = await getUserBalance();

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
        ctx.render(homeTemplate({ filters, transactions, balance }));
    }

    update()
}