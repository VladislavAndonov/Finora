import { html } from 'https://esm.run/lit-html@1';
import { transactionList } from './common/transactionList.js';
import { getTransactions } from '../api/data.js';

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

const calendarTemplate = (currDate, datesTemplate, showPrevMonth, showNextMonth, selectDate, transactions) =>
    html`
    <div class="calendar">
        <div class="calendar-wrapper">
            <header class="calendar-header">
                <i class="fa-solid fa-angle-left prev" @click=${showPrevMonth}></i>
                <h3 class=current-date>${months[currDate.getMonth()]} ${currDate.getFullYear()}</h3>
                <i class="fa-solid fa-angle-right next" @click=${showNextMonth}></i>
            </header>

            <div class="calendar-body">

                <ul class="weekdays">
                    <li>Mon</li>
                    <li>Tue</li>
                    <li>Wed</li>
                    <li>Thu</li>
                    <li>Fri</li>
                    <li>Sat</li>
                    <li>Sun</li>
                </ul>

                <ul class="dates" @click=${selectDate}>
                    ${datesTemplate}
                </ul>
            </div>
        </div>
        <div class=transaction-list>
            ${transactionList(transactions)}
        </div>
    </div>`;


export async function calendarView(ctx) {
    const today = new Date();
    let selectedDate = today;
    let currDate = new Date();
    let transactions = await getTransactions({ year: selectedDate.getFullYear(), month: selectedDate.getMonth(), date: selectedDate.getDate() }, {});

    const showPrevMonth = () => {
        currDate = new Date(currDate.getFullYear(), currDate.getMonth() - 1, 1);
        updateMonth(ctx)
    }

    const showNextMonth = () => {
        currDate = new Date(currDate.getFullYear(), currDate.getMonth() + 1, 1);
        updateMonth(ctx)
    }

    const selectDate = async (e) => {
        if (e.target.tagName === 'LI') {
            selectedDate = new Date(currDate.getFullYear(), currDate.getMonth(), e.target.textContent);
        }
        transactions = await getTransactions({ year: selectedDate.getFullYear(), month: selectedDate.getMonth(), date: selectedDate.getDate() }, {});

        updateMonth(ctx, transactions)
    }

    const renderDates = (datesTemplate, monthLastDate, monthStartPosition) => {
        for (let i = 1; i <= monthLastDate; i++) {
            let isToday = false;
            let isSelected = false;
            if (today.getFullYear() === currDate.getFullYear() && today.getMonth() === currDate.getMonth() && today.getDate() === i) {
                isToday = true;
            }
            if (selectedDate.getFullYear() === currDate.getFullYear() && selectedDate.getMonth() === currDate.getMonth() && selectedDate.getDate() === i) {
                isSelected = true
            }
            if (i === 1) {
                datesTemplate.push(html`
            <li class="grid-item-${i} ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}" style="grid-column: ${monthStartPosition}">${i}</li>`)
            } else {
                datesTemplate.push(html`
            <li class="grid-item-${i} ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}">${i}</li>`)
            }
        };
    }

    const updateMonth = (ctx) => {
        const firstWeekday = new Date(currDate.getFullYear(), currDate.getMonth(), 1).getDay();
        const monthLastDate = new Date(currDate.getFullYear(), currDate.getMonth() + 1, 0).getDate();

        // Convert weekday (0-6, Sun-Sat) to 1-7 position (Mon-Sun)
        let monthStartPosition = (firstWeekday + 6) % 7 + 1


        const datesTemplate = [];

        renderDates(datesTemplate, monthLastDate, monthStartPosition)
        ctx.render(calendarTemplate(currDate, datesTemplate, showPrevMonth, showNextMonth, selectDate, transactions));
    }

    updateMonth(ctx);
}