import mongoose from "mongoose";
import { Transaction } from "../models/Transaction.js";
import { Account } from "../models/Account.js";

const transactionService = {
    async getTransactions(filter, limit) {
        const transactions = await Transaction.find(filter).sort({ "date": "desc" }).limit(limit);

        const formattedTransactions = transactions.map((transaction) => {
            const transactionObject = transaction.toObject();
            transactionObject.amount = transactionObject.amountCents / 100;
            delete transactionObject.amountCents;
            return transactionObject;
        });

        return formattedTransactions
    },
    async getOne(transactionId) {
        const transaction = await Transaction.findById(transactionId);

        if (!transaction) {
            return null
        }

        const transactionObject = transaction.toObject();
        transactionObject.amount = transactionObject.amountCents / 100;
        delete transactionObject.amountCents;

        return transactionObject;

    },
    async create(transactionData) {
        const session = await mongoose.startSession()
        session.startTransaction()

        try {
            const [transaction] = await Transaction.create([transactionData], { session });

            const balanceChange = transactionData.type === "income" ? transaction.amountCents : -transaction.amountCents;

            await Account.findByIdAndUpdate(transactionData.accountId, { $inc: { balanceCents: balanceChange } }, { session })

            await session.commitTransaction();

            const transactionObject = transaction.toObject();
            transactionObject.amount = transactionObject.amountCents / 100;
            delete transactionObject.amountCents;
            return transactionObject;

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

            const oldBalanceChange = oldTransaction.type === "income" ? -oldTransaction.amountCents : oldTransaction.amountCents;
            await Account.findByIdAndUpdate(oldTransaction.accountId, { $inc: { balanceCents: oldBalanceChange } }, { session })

            const newBalanceChange = transactionData.type === "income" ? transactionData.amountCents : -transactionData.amountCents;
            await Account.findByIdAndUpdate(transactionData.accountId, { $inc: { balanceCents: newBalanceChange } }, { session })

            const updatedTransaction = await Transaction.findByIdAndUpdate(transactionId, { ...transactionData }, { new: true, runValidators: true, session })

            await session.commitTransaction();

            const transactionObject = updatedTransaction.toObject();
            transactionObject.amount = transactionObject.amountCents / 100;
            delete transactionObject.amountCents;
            return transactionObject;

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
            const transaction = await Transaction.findById(transactionId, null, { session })

            const balanceChange = transaction.type === "income" ? -transaction.amountCents : transaction.amountCents;

            await Account.findByIdAndUpdate(transaction.accountId, { $inc: { balanceCents: balanceChange } }, { session })

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