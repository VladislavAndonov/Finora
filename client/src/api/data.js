import * as api from "./api.js";

const host = import.meta.env.VITE_API_URL;
api.settings.host = host;

export const login = api.login;
export const register = api.register;
export const logout = api.logout;
export const verifySession = api.verifySession;

export async function getTransactions(filters = {}, options = {}) {
    const params = new URLSearchParams();
    const {
        type,
        year,
        month,
        date,
    } = filters;

    const {
        limit = 100
    } = options;

    // Filters
    if (type) {
        params.append("type", type);
    }
    if (year) {
        params.append("year", year);
    }
    if (month || month !== undefined) {
        params.append("month", month);
    }
    if (date) {
        params.append("date", date);
    }

    // Query options
    params.append("limit", limit)

    const queryString = params.toString();

    if (queryString) {
        return api.get(`/transactions?${queryString}`)
    } else {
        return api.get("/transactions")
    }
}

export async function getTransactionById(id) {
    return await api.get("/transactions/" + id);
}

export async function addTransaction({ title, type, amount, date = new Date(), category = "general" }) {
    return await api.post("/transactions/", { title, type, amount, date, category });
}

export async function editTransaction(id, data) {
    return await api.put("/transactions/" + id, data);
}

export async function deleteTransaction(id) {
    return await api.del("/transactions/" + id);
}

export async function getUserBalance() {
    return await api.get("/balance")
}