export function utcToLocal(localDate) {
    const date = new Date(localDate);
    const convertedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000).toISOString();
    return convertedDate.slice(0, 16);
}

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

export function getMonthAndYearLabel(currentDate) {
    return `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`
}