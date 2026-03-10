import mongoose from "mongoose";
import { Transaction } from "../models/Transaction.js";
import { Account } from "../models/Account.js";

const transactionService = {
    async getTransactions(filter, limit) {
        return await Transaction.find(filter).sort({ "date": "desc" }).limit(limit);
    },
    async getOne(transactionId) {
        return await Transaction.findById(transactionId);
    },
    async create(transactionData) {
        // return await Transaction.create(transactionData);

        const session = await mongoose.startSession()
        session.startTransaction()

        try {
            const [transaction] = await Transaction.create([transactionData], { session });

            const balanceChange = transactionData.type === "income" ? transaction.amount : -transaction.amount;

            await Account.findByIdAndUpdate(transactionData.accountId, { $inc: { balance: balanceChange } }, { session })

            await session.commitTransaction();

            return transaction;
        } catch (error) {
            await session.abortTransaction()
            throw error
        } finally {
            session.endSession()
        }


    },
    async update(transactionId, transactionData) {
        // return await Transaction.findByIdAndUpdate(transactionId, transactionData);

        const session = await mongoose.startSession()
        session.startTransaction()

        try {
            const oldTransaction = await Transaction.findById(transactionId, null, { session })

            if (!oldTransaction) {
                throw new Error("Transaction not found")
            }

            // Reverse balance from current transaction
            const oldBalanceChange = oldTransaction.type === "income" ? -oldTransaction.amount : oldTransaction.amount;

            await Account.findByIdAndUpdate(oldTransaction.accountId, { $inc: { balance: oldBalanceChange } }, { session })

            // Add new balance change
            const newBalanceChange = transactionData.type === "income" ? transactionData.amount : -transactionData.amount

            await Account.findByIdAndUpdate(transactionData.accountId, { $inc: { balance: newBalanceChange } }, { session })

            const updatedTransaction = await Transaction.findByIdAndUpdate(transactionId, { ...transactionData }, { new: true, session })

            await session.commitTransaction();
            return updatedTransaction
        } catch (error) {
            await session.abortTransaction()
            throw error
        } finally {
            session.endSession()
        }
    },
    async delete(transactionId) {
        // return await Transaction.findByIdAndDelete(transactionId);

        const session = await mongoose.startSession()
        session.startTransaction()

        try {
            const transaction = await Transaction.findById(transactionId).session(session)
            if (!transaction) {
                throw new Error("Transaction not found")
            }

            const balanceChange = transaction.type === "income" ? transaction.amount : -transaction.amount

            await Account.findByIdAndUpdate(transaction.accountId, { $inc: { balance: balanceChange } }).session(session)

            await Transaction.findByIdAndDelete(transactionId).session(session)

            await session.commitTransaction()
        } catch (error) {
            await session.abortTransaction()
            throw error
        } finally {
            session.endSession()
        }
    },
}

export default transactionService;