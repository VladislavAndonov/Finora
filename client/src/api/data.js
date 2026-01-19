import * as api from "./api.js";

const host = "http://localhost:3000";
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
        sort = "date",
        order = "desc",
        limit = 100
    } = options;

    // Filters
    if (type) {
        params.append("type", type);
    }
    if (year && month) {
        params.append("year", year);
        params.append("month", month);
    }
    if (date) {
        params.append("date", date);
    }

    // Query options
    params.append("sort", sort);
    params.append("order", order);
    params.append("limit", limit)

    const queryString = params.toString();

    if (queryString) {
        return api.get(`/transactions/?${queryString}`)
    } else {
        return api.get("/transactions")
    }
}

export async function getTransactionById(id) {
    return await api.get("/transactions/" + id);
}

export async function addTransaction(data) {
    return await api.post("/transactions/", data);
}

export async function editTransaction(data) {
    return await api.put("/transactions/" + id, data);
}

export async function deleteTransaction(id) {
    return await api.del("/transactions/" + id);
}