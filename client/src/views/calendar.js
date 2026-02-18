import "../../styles/calendar.css"

import { html } from "lit-html";

import { transactionList } from './common/transactionList.js';
import { getTransactions } from '../api/data.js';
import { getMonthAndYearLabel } from '../utils/dateUtils.js';

const calendarTemplate = ({ currentDate, transactions, showPrevMonth, showNextMonth, selectDate, dates, filters }) =>
    html`
    <div class="calendar">
        <header class="calendar__header">
            <h2 class="calendar__title">Calendar</h2>
        </header>

        <div class="calendar__content">

            <div class="calendar__body">

                <div class="calendar__nav-bar">
                    <button class="calendar__nav-btn calendar__nav-btn--prev" @click=${showPrevMonth}>
                        <i class="fa-solid fa-angle-left"></i>
                    </button>
                    <h4 class="calendar__month">${getMonthAndYearLabel(currentDate)}</h4>
                    <button class="calendar__nav-btn calendar__nav-btn--next" @click=${showNextMonth}>
                        <i class="fa-solid fa-angle-right"></i>
                    </button>
                </div>

                <div class="calendar__grid">
                    <ul class="calendar__weekdays">
                        <li class="calendar__weekday">Mon</li>
                        <li class="calendar__weekday">Tue</li>
                        <li class="calendar__weekday">Wed</li>
                        <li class="calendar__weekday">Thu</li>
                        <li class="calendar__weekday">Fri</li>
                        <li class="calendar__weekday">Sat</li>
                        <li class="calendar__weekday">Sun</li>
                    </ul>

                    <ul class="calendar__dates" @click=${selectDate}>
                        ${dates}
                    </ul>

                </div>
           

            </div>

            <section class="calendar__transactions">
                ${transactionList(filters, transactions)}
            </section>

        </div>
            
    </div>`;


export async function calendarView(ctx) {
    const state = {
        today: new Date(),
        currentDate: new Date(),
        selectedDate: new Date(),
        monthTransactions: [],
        selectedDateTransactions: {
            all: [],
            expenses: [],
            income: []
        },
        ui: {
            activeTab: "all",
        }
    }

    state.maxDate.setMonth(state.today.getMonth() + 7);
    state.minDate.setMonth(state.today.getMonth() - 13)

    async function loadMonthTransactions() {
        state.monthTransactions = await getTransactions({
            year: state.currentDate.getFullYear(),
            month: state.currentDate.getMonth()
        })
    }

    state.selectedDateTransactions = await getTransactions({
        year: state.selectedDate.getFullYear(),
        month: state.selectedDate.getMonth(),
        date: state.selectedDate.getDate()
    });

    const showAllTransactions = async () => {
        state.selectedDateTransactions = await getTransactions({
            year: state.selectedDate.getFullYear(),
            month: state.selectedDate.getMonth(),
            date: state.selectedDate.getDate()
        });
        setActive("All");
        update();
    };

    const showExpenses = async () => {
        state.selectedDateTransactions = await getTransactions({
            year: state.selectedDate.getFullYear(),
            month: state.selectedDate.getMonth(),
            date: state.selectedDate.getDate(),
            type: "expenses"
        });
        setActive("Expenses");
        update();
    };

    const showIncome = async () => {
        state.selectedDateTransactions = await getTransactions({
            year: state.selectedDate.getFullYear(),
            month: state.selectedDate.getMonth(),
            date: state.selectedDate.getDate(),
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

    const selectDate = async (e) => {
        if (e.target.tagName === 'LI') {
            const day = Number(e.target.dataset.day);
            state.selectedDate = new Date(
                state.currentDate.getFullYear(),
                state.currentDate.getMonth(),
                day
            );

            state.selectedDateTransactions = await getTransactions({
                year: state.selectedDate.getFullYear(),
                month: state.selectedDate.getMonth(),
                date: state.selectedDate.getDate()
            });

            setActive("All");
            update()
        }
    }

    function getDisplayedTransactions() {
        const transactionsByDate = {}
        let transactions = []

        switch (state.ui.activeTab) {
            case "expenses":
                transactions = state.selectedDateTransactions.expenses;
                break
            case "income":
                transactions = state.selectedDateTransactions.income;
                break
            default:
                transactions = state.selectedDateTransactions.all;
        }


        for (const transaction of transactions) {
            const dateKey = formatDate(transaction.date)

            if (transactionsByDate.hasOwnProperty(dateKey)) {
                transactionsByDate[dateKey].push(transaction)
            } else {
                transactionsByDate[dateKey] = [transaction]
            }
        }

        return transactionsByDate
    }

    getDisplayedTransactions()

    // Builds an array of date objects to render them later. Each one contains properties like isToday, isSelected etc.
    const buildDates = () => {
        const todayYear = state.today.getFullYear();
        const todayMonth = state.today.getMonth();
        const todayDay = state.today.getDate();

        const currentYear = state.currentDate.getFullYear();
        const currentMonth = state.currentDate.getMonth();

        const selectedYear = state.selectedDate.getFullYear();
        const selectedMonth = state.selectedDate.getMonth();
        const selectedDay = state.selectedDate.getDate();

        const firstWeekday = new Date(currentYear, currentMonth, 1).getDay();
        const monthLastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

        // Convert weekday (0-6, Sun-Sat) to 1-7 position (Mon-Sun)
        const startColumn = (firstWeekday + 6) % 7 + 1

        const dates = [];

        // Add dates on which any transactions were made in a set
        const transactionDays = new Set();
        for (let i = 0; i < state.monthTransactions.length; i++) {
            const day = new Date(state.monthTransactions[i].date).getDate();
            transactionDays.add(day)
        }

        for (let day = 1; day <= monthLastDate; day++) {
            let dateObj = {
                day: day,
                isToday: false,
                isSelected: false,
                hasTransactions: false,
                startColumn: null
            }

            if (todayYear === currentYear &&
                todayMonth === currentMonth &&
                todayDay === day) {
                dateObj.isToday = true;
            }
            if (selectedYear === currentYear &&
                selectedMonth === currentMonth &&
                selectedDay === day) {
                dateObj.isSelected = true;
            }

            if (transactionDays.has(day)) {
                dateObj.hasTransactions = true;
            }

            if (day === 1) {
                dateObj.startColumn = startColumn;
            }
            dates.push(dateObj)
        };
        return dates
    }

    function renderDate(dates) {
        return dates.map((d) => html`
            <li class="calendar__date ${d.isToday ? "calendar__date--today " : ""}${d.isSelected ? "calendar__date--selected " : ""}${d.hasTransactions ? "calendar__date--has-transactions" : ""}" data-day=${d.day} style="${d.startColumn ? `grid-column: ${d.startColumn}` : ""}">${d.day}</li>
        `);
    }

    const update = () => {
        const dates = buildDates();

        ctx.render(calendarTemplate({
            currentDate: state.currentDate,
            transactions: state.selectedDateTransactions,
            showPrevMonth,
            showNextMonth,
            selectDate,
            dates: renderDate(dates),
            filters
        }
        ));
    }

    update();
}