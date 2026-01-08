import { html, render } from 'https://esm.run/lit-html@1';
import { appLayout } from './common/appLayout.js';

const root = document.querySelector(".app");
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

const calendarTemplate = (currDate, datesTemplate, showPrevMonth, showNextMonth, selectDate) =>
    html`
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
    </div>`;


export async function calendarPage() {
    let currDate = new Date();

    const showPrevMonth = () => {
        currDate = new Date(currDate.getFullYear(), currDate.getMonth() - 1, 1);
        updateMonth()
    }

    const showNextMonth = () => {
        currDate = new Date(currDate.getFullYear(), currDate.getMonth() + 1, 1);
        updateMonth()
    }

    const selectDate = (e) => {
        // TODO: Create logic for selection
        if (e.target.tagName === 'LI') {
            console.log(`Clicked on ${e.target.textContent}`);
        }
    }

    const updateMonth = () => {
        const firstWeekday = currDate.getDay();
        const monthLastDate = new Date(currDate.getFullYear(), currDate.getMonth() + 1, 0).getDate();

        // Convert weekday (0-6, Sun-Sat) to 1-7 position (Mon-Sun)
        let monthStartPosition = (firstWeekday + 6) % 7 + 1

        const datesTemplate = [];

        for (let i = 1; i <= monthLastDate; i++) {
            // TODO: Highlight today's date
            // Check if today match with currDate.year, month and date

            if (i === 1) {
                datesTemplate.push(html`
            <li class="grid-item-${i}" style="grid-column: ${monthStartPosition}"</li>`)
            } else {
                datesTemplate.push(html`
            <li class="grid-item-${i}">${i}</li>`)
            }
        };

        render(appLayout(calendarTemplate(currDate, datesTemplate, showPrevMonth, showNextMonth, selectDate)), root);
    }
    updateMonth();
}