const ACTIVE_ACCOUNT_ID = "activeAccountId";

export const getActiveAccountId = () => {
    return sessionStorage.getItem(ACTIVE_ACCOUNT_ID)
}

export const setActiveAccountId = (accountId) => {
    sessionStorage.setItem(ACTIVE_ACCOUNT_ID, accountId)
}
export const clearActiveAccountId = () => {
    sessionStorage.removeItem(ACTIVE_ACCOUNT_ID)
}