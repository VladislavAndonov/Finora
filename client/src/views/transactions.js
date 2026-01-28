import { html } from 'https://esm.run/lit-html@1';
import { getTransactions } from '../api/data.js';
import { transactionList } from './common/transactionList.js';
import { getMonthAndYearLabel } from '../utils/dateUtils.js';

const transactionsTemplate = ({ transactions, currentDate, showPrevMonth, showNextMonth, filters }) =>
    html`<div class="transactions">
            <div class="transactions-wrapper">
                <header class="transactions-header">
                    <i class="fa-solid fa-angle-left prev" @click=${showPrevMonth}></i>
                    <h3 class=current-date>${getMonthAndYearLabel(currentDate)}</h3>
                    <i class="fa-solid fa-angle-right next" @click=${showNextMonth}></i>
                </header>
                <section class=transaction-list>
                    ${transactionList(filters, transactions)}
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