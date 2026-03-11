import mongoose from "mongoose";
import { Transaction } from "../models/Transaction.js";
import { Account } from "../models/Account.js";

// Helper function to avoid floating point imprecision
const toFixedAmount = (amount) => Math.round(amount * 100) / 100;

const transactionService = {
    async getTransactions(filter, limit) {
        return await Transaction.find(filter).sort({ "date": "desc" }).limit(limit);
    },
    async getOne(transactionId) {
        return await Transaction.findById(transactionId);
    },
    async create(transactionData) {
        const session = await mongoose.startSession()
        session.startTransaction()

        try {
            const [transaction] = await Transaction.create([transactionData], { session });

            const balanceChange = toFixedAmount(transactionData.type === "income" ? transaction.amount : -transaction.amount);

            await Account.findByIdAndUpdate(transactionData.accountId, { $inc: { balance: balanceChange } }, { session })

            await session.commitTransaction();
            return transaction;
        } catch (err) {
            await session.abortTransaction()
            throw err
        } finally {
            session.endSession()
        }
    },
    async update(transactionId, transactionData) {
        const session = await mongoose.startSession()
        session.startTransaction()

        try {
            const oldTransaction = await Transaction.findById(transactionId, null, { session })

            const oldBalanceChange = toFixedAmount(oldTransaction.type === "income" ? -oldTransaction.amount : oldTransaction.amount);
            await Account.findByIdAndUpdate(oldTransaction.accountId, { $inc: { balance: oldBalanceChange } }, { session })

            const newBalanceChange = toFixedAmount(transactionData.type === "income" ? transactionData.amount : -transactionData.amount);
            await Account.findByIdAndUpdate(transactionData.accountId, { $inc: { balance: newBalanceChange } }, { session })

            const updatedTransaction = await Transaction.findByIdAndUpdate(transactionId, { ...transactionData }, { new: true, session })

            await session.commitTransaction();
            return updatedTransaction
        } catch (err) {
            await session.abortTransaction()
            throw err
        } finally {
            session.endSession()
        }
    },
    async delete(transactionId) {
        const session = await mongoose.startSession()
        session.startTransaction()

        try {
            const transaction = await Transaction.findById(transactionId, { session })

            const balanceChange = toFixedAmount(transaction.type === "income" ? -transaction.amount : transaction.amount);

            await Account.findByIdAndUpdate(transaction.accountId, { $inc: { balance: balanceChange } }, { session })

            await Transaction.findByIdAndDelete(transactionId, { session })

            await session.commitTransaction()
        } catch (err) {
            await session.abortTransaction()
            throw err
        } finally {
            session.endSession()
        }
    },
}

export default transactionService;