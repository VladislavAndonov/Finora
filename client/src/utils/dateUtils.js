export function utcToLocal(localDate) {
    const date = new Date(localDate);
    const convertedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000).toISOString();
    return convertedDate.slice(0, 16);
}

export function formatDate(isoString) {
    const date = new Date(isoString)
    const weekday = date.toLocaleDateString('en-GB', {
        weekday: 'long',
    });

    const dayAndMonth = date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
    });

    return `${weekday}, ${dayAndMonth}`;
}

export function formatHour(dateStr) {
    if (!dateStr) return '12';
    const d = new Date(dateStr);
    return String(d.getHours() % 12 || 12).padStart(2, '0');
}
export function formatMinute(dateStr) {
    if (!dateStr) return '00';
    return String(new Date(dateStr).getMinutes()).padStart(2, '0');
}
export function formatAmPm(dateStr) {
    if (!dateStr) return 'AM';
    return new Date(dateStr).getHours() >= 12 ? 'PM' : 'AM';
}