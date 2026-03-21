import "../../styles/calendar.css"

import { html } from "lit-html";

import { transactionList } from './common/transactionList.js';
import { getTransactions } from '../api/data.js';
import { formatDate } from '../utils/dateUtils.js';
import { getActiveAccountId } from "../state/sessionState.js";

const calendarTemplate = ({ transactionsByDate, monthList, dates, filters, state, selectDate, selectMonth, handleWheel }) =>
    html`
    <div class="calendar">
        <header class="calendar__header">
            <h1 class="calendar__title">Calendar</h1>
        </header>

        <div class="calendar__content">

            <section class="calendar__section calendar__body">
                <div class="calendar__months">
                    <div class="calendar__month-scroll" id="month-scroll" @wheel=${handleWheel}>
                        ${monthList.map((m) => html`
                            <button 
                                class="calendar__month-item ${state.currentDate.getFullYear() === m.year && state.currentDate.getMonth() === m.month ? "calendar__month-item--active" : ""} ${state.today.getFullYear() === m.year && state.today.getMonth() === m.month ? "calendar__month-item--current" : ""}" 
                                @click=${() => selectMonth(m.year, m.month)}>${m.label}
                                ${state.today.getFullYear() !== m.year ? html`<span class="calendar__year-label">${m.year}</span>` : ""}
                            </button>`)}
                    </div>
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
            </section>
                        
            <section class="calendar__section calendar__transactions ${state.selectedDateTransactions.all.length !== 0 ? "calendar__transactions--active" : "calendar__transactions--hidden"}">
                 ${transactionList(filters, transactionsByDate)}
            </section>
            

        </div>
            
    </div>`;


export async function calendarView(ctx) {
    const state = {
        today: new Date(),
        currentDate: new Date(),
        selectedDate: new Date(),
        minDate: new Date(),
        maxDate: new Date(),
        activeAccountId: getActiveAccountId() || null,
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
        if (!state.activeAccountId) return;

        state.monthTransactions = await getTransactions({
            accountId: state.activeAccountId,
            year: state.currentDate.getFullYear(),
            month: state.currentDate.getMonth()
        })
    }

    await loadMonthTransactions()

    async function loadSelectedDateTransactions() {
        if (!state.activeAccountId) return;

        const transactions = await getTransactions({
            accountId: state.activeAccountId,
            year: state.selectedDate.getFullYear(),
            month: state.selectedDate.getMonth(),
            date: state.selectedDate.getDate()
        });

        if (!transactions) return;

        state.selectedDateTransactions.all = transactions;
        state.selectedDateTransactions.expenses = transactions.filter((t) => t.type === "expenses");
        state.selectedDateTransactions.income = transactions.filter((t) => t.type === "income");
    }

    await loadSelectedDateTransactions()

    async function showAllTransactions() {
        state.ui.activeTab = "all"
        setActive("All");
        update();
    };

    async function showExpenses() {
        state.ui.activeTab = "expenses";
        setActive("Expenses");
        update();
    };

    function showIncome() {
        state.ui.activeTab = "income";
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

    function buildMonthList() {
        const months = [];
        let current = new Date(state.minDate.getFullYear(), state.minDate.getMonth(), 1);
        const end = new Date(state.maxDate.getFullYear(), state.maxDate.getMonth(), 1);

        while (current <= end) {
            months.push({
                year: current.getFullYear(),
                month: current.getMonth(),
                label: current.toLocaleDateString("en-GB", {
                    month: "long",
                }),
            });

            current.setMonth(current.getMonth() + 1);
        }
        return months
    }

    async function selectMonth(year, month) {
        state.currentDate = new Date(year, month, 1)

        await loadMonthTransactions()
        state.ui.activeTab = "all"
        setActive("All");
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

            await loadSelectedDateTransactions()
            state.ui.activeTab = "all"
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

    const handleWheel = (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.preventDefault();
            e.currentTarget.scrollLeft += e.deltaY;
        }
    };

    const update = () => {
        const dates = buildDates();
        ctx.render(calendarTemplate({
            transactionsByDate: getDisplayedTransactions(),
            monthList: buildMonthList(),
            dates: renderDate(dates),
            filters,
            state,
            selectDate,
            selectMonth,
            handleWheel
        }));


        const monthScroll = document.getElementById('month-scroll');
        setTimeout(() => {
            const active = monthScroll?.querySelector('.calendar__month-item--active');
            active?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }, 0);

    }

    update();
}