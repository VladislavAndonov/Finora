import { html } from 'https://esm.run/lit-html@1';
import { getTransactions } from '../api/data.js';
import { transactionList } from './common/transactionList.js';

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

const transactionsTemplate = (transactions, currentDate, showPrevMonth, showNextMonth) =>
    html`<div class="transactions">
            <div class="transactions-wrapper">
                <header class="transactions-header">
                    <i class="fa-solid fa-angle-left prev" @click=${showPrevMonth}></i>
                    <h3 class=current-date>${months[currentDate.getMonth()]} ${currentDate.getFullYear()}</h3>
                    <i class="fa-solid fa-angle-right next" @click=${showNextMonth}></i>
                </header>
                <div class=transaction-list>
                    ${transactions.length ? transactionList(transactions) : html`<p>No transactions for ${months[currentDate.getMonth()]}</p>`}
                </div>
            </div>
        </div>`;

export const transactionsView = async (ctx) => {
    const state = {
        currentDate: new Date(),
        monthTransactions: [],
    }

    state.monthTransactions = await getTransactions({
        year: state.currentDate.getFullYear(),
        month: state.currentDate.getMonth()
    });

    const showPrevMonth = async () => {
        state.currentDate = new Date(
            state.currentDate.getFullYear(),
            state.currentDate.getMonth() - 1,
            1
        );
        state.monthTransactions = await getTransactions({
            year: state.currentDate.getFullYear(),
            month: state.currentDate.getMonth()
        });

        update(ctx)
    }

    const showNextMonth = async () => {
        state.currentDate = new Date(
            state.currentDate.getFullYear(),
            state.currentDate.getMonth() + 1,
            1
        );
        state.monthTransactions = await getTransactions({
            year: state.currentDate.getFullYear(),
            month: state.currentDate.getMonth()
        });

        update(ctx)
    }

    const update = () => {
        ctx.render(transactionsTemplate(state.monthTransactions, state.currentDate, showPrevMonth, showNextMonth));
    }

    update()
}