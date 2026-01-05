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

    monthStartPosition = (firstWeekday + 6) % 7 + 1

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