export const getActiveAccountId = () => {
    return sessionStorage.getItem("activeAccountId")
}

export const setActiveAccountId = (accountId) => {
    sessionStorage.setItem("activeAccountId", accountId)

    if (accountId === null || accountId === undefined) {
        sessionStorage.removeItem('activeAccountId');
    } else {
        sessionStorage.setItem('activeAccountId', accountId);
    }
}

export const clearActiveAccountId = () => {
    sessionStorage.removeItem("activeAccountId")
}