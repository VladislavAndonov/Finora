const root = document.querySelector(".main-content");

export function calendarPage() {
    root.innerHTML = `
    <div class="calendar-wrapper">
        <header class="calendar-header">
            <i class="fa-solid fa-angle-left prev" onclick=showPrevMonth()></i>
            <h3 class="current-date"></h3>
            <i class="fa-solid fa-angle-right next" onclick=showNextMonth()></i>
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

            <ul class="dates"></ul>
        </div>
    </div>`
}


/*
let currDate = new Date();

let [date, month, year] = [
    currDate.getDate(),
    currDate.getMonth(),
    currDate.getFullYear()
]

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


const updateMonth = () => {
    const firstWeekday = new Date(year, month).getDay()
    const monthLastDate = new Date(year, month + 1, 0).getDate()
    // const lastWeekday = new Date(year, month, monthLastDate).getDay()
    // const prevMonthLastDate = new Date(year, month, 0).getDate()

    let monthStartPosition = (firstWeekday + 6) % 7 + 1

    let buffer = "";

    for (let i = 1; i <= monthLastDate; i++) {
        buffer += `<li class="grid-item-${i}">${i}</li>`
        document.querySelector(".dates").innerHTML = buffer
    }

    document.querySelector(".grid-item-1").style.gridColumn = monthStartPosition


}

updateMonth()

const renderMonth = () => {
    document.querySelector(".current-date").textContent = `${months[month]} ${year}`
}

renderMonth()


const showPrevMonth = () => {
    const prevArrow = document.querySelector(".prev")
    prevArrow.addEventListener(onclick, (() => {
        month = --month

        if (month < 0) {
            currDate = new Date(year, month, date)
            year = currDate.getFullYear()
            month = currDate.getMonth()
        }

        renderMonth()
        updateMonth()
    })());
}


const showNextMonth = () => {
    const prevArrow = document.querySelector(".next")
    prevArrow.addEventListener(onclick, (() => {
        month = ++month

        if (month > 11) {
            currDate = new Date(year, month, date)
            year = currDate.getFullYear()
            month = currDate.getMonth()
        }

        renderMonth()
        updateMonth()
    })());
}

const highlightToday = () => {
    // TODO: Create a function to highlight today's date
}

*/