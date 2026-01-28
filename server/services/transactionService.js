import { Transaction } from "../models/Transaction.js";

const transactionService = {
    async getTransactions(filter, limit) {
        return await Transaction.find(filter).sort({ "date": "desc" }).limit(limit);
    },
    async getOne(transactionId) {
        return await Transaction.findById(transactionId);
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
}

export default transactionService;