import { Transaction } from "../models/Transaction.js";

const transactionService = {
    async getAll(user) {
        return await Transaction.find({ ownerId: user });
    },
    async getLatest(user) {
        return await Transaction.find({ ownerId: user }).sort({ date: -1 }).limit(10);
    },
    async getExpenses(user) {
        return await Transaction.find({ ownerId: user, type: "expenses" });
    },
    async getIncome(user) {
        return await Transaction.find({ ownerId: user, type: "income" });
    },
    async create(transactionData) {
        return await Transaction.create(transactionData);
    },
    async update(transactionId, transactionData) {
        return await Transaction.findByIdAndUpdate(transactionId, transactionData);
    },
    async delete(transactionId) {
        return await Transaction.findByIdAndDelete(transactionId);
    },
    async getOne(transactionId) {
        return await Transaction.findById(transactionId);
    },

}

export default transactionService;