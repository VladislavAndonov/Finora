export function utcToLocal(localDate) {
    const date = new Date(localDate);
    const convertedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000).toISOString();
    return convertedDate.slice(0, 16);
}

export function formatDate(isoString) {
    const date = new Date(isoString)
    const weekday = date.toLocaleDateString('en-GB', {
        weekday: 'long',
        timeZone: 'UTC'
    });

    const dayAndMonth = date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        timeZone: 'UTC'
    });

    return `${weekday}, ${dayAndMonth}`;
}