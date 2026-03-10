import mongoose from "mongoose";

import { Account } from "../models/Account.js";
import { Transaction } from "../models/Transaction.js";

const accountService = {
    async getAccounts(filters) {
        return await Account.find(filters);
    },
    async getOne(accountId) {
        return await Account.findById(accountId)
    },
    async create({ name, ownerId, currency, startingBalance = 0 }) {
        const session = await mongoose.startSession()
        session.startTransaction()

        try {
            const [account] = await Account.create([{ name, ownerId, currency, balance: 0 }], { session })

            if (startingBalance !== 0)
                await Transaction.create([{
                    title: "Opening Balance",
                    ownerId,
                    accountId: account._id,
                    type: startingBalance > 0 ? 'income' : 'expense',
                    amount: startingBalance,
                    category: "Other",
                    note: "Initial account balance",
                    isOpeningBalance: true,
                    date: new Date()
                }], { session });

            await Account.findByIdAndUpdate(account._id, { $inc: { balance: startingBalance } }, { session });

            await session.commitTransaction()
            return account
        } catch (error) {
            await session.abortTransaction()
            console.log("Failed to create account", error)
        } finally {
            session.endSession()
        }

    },
    async update(accountId, accountData) {
        return await Account.findByIdAndUpdate(accountId, accountData);
    },
    async delete(accountId) {
        return await Account.findByIdAndDelete(accountId);
    }
}

export default accountService