import { Transaction } from "../models/Transaction.js";

const transactionService = {
    async getAll() {
        return await Transaction.find();
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