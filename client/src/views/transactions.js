import "../../styles/transactions.css"

import { html } from "lit-html";

import { getTransactions } from '../api/data.js';
import { transactionList } from './common/transactionList.js';
import { getMonthAndYearLabel } from '../utils/dateUtils.js';

const transactionsTemplate = ({ transactions, currentDate, showPrevMonth, showNextMonth, filters }) =>
    html`
    <div class="transactions-view">
        <header class="transactions-view-header">
            <h2 class="transactions-view-title">Transactions</h2>
        </header>

        <div class="transactions-view-layout">

            <section class="transactions-list">
                <header class="transactions-list-header">
                     <button
                        class="transactions-list-nav transactions-list-nav-prev"
                        @click=${showPrevMonth}
                        aria-label="Previous month">
                        <i class="fa-solid fa-angle-left" aria-hidden="true"></i>
                    </button>
                    <h3 class="transactions-list-current-month">${getMonthAndYearLabel(currentDate)}</h3>
                    <button
                        class="transactions-list-nav transactions-list-nav-next"
                        @click=${showNextMonth}
                        aria-label="Next month">
                        <i class="fa-solid fa-angle-right" aria-hidden="true"></i>
                    </button>
                </header>

                <div class="transactions-list-body">
                    ${transactionList(filters, transactions)}
                </div>
            </section>

            <section class="transactions-chart">
                <canvas id="transactions-chart-canvas"></canvas>
            </section>

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

    const showAllTransactions = async () => {
        state.monthTransactions = await getTransactions({
            year: state.currentDate.getFullYear(),
            month: state.currentDate.getMonth()
        });
        setActive("All");
        update();
    };

    const showExpenses = async () => {
        state.monthTransactions = await getTransactions({
            year: state.currentDate.getFullYear(),
            month: state.currentDate.getMonth(),
            type: "expenses"
        });
        setActive("Expenses");
        update();
    };

    const showIncome = async () => {
        state.monthTransactions = await getTransactions({
            year: state.currentDate.getFullYear(),
            month: state.currentDate.getMonth(),
            type: "income"
        });
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

        update()
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

        update()
    }

    const update = () => {
        ctx.render(transactionsTemplate({ transactions: state.monthTransactions, currentDate: state.currentDate, showPrevMonth, showNextMonth, filters }));
    }

    update();
}