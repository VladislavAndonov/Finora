import * as api from "./api.js";

const host = "http://localhost:3000";
api.settings.host = host;

export const login = api.login;
export const register = api.register;
export const logout = api.logout;
export const verifySession = api.verifySession;

export async function getTransactions() {
    return await api.get("/transactions");
}

export async function getLatestTransactions() {
    return await api.get("/transactions/latest");
}

export async function getExpenses() {
    return await api.get("/transactions/expenses");
}

export async function getIncome() {
    return await api.get("/transactions/income");
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