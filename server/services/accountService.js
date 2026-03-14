import mongoose from "mongoose";

import { Account } from "../models/Account.js";
import { Transaction } from "../models/Transaction.js";

const accountService = {
    async getAccounts(filters) {
        const accounts = await Account.find(filters);

        const formattedAccounts = accounts.map((account) => {
            const accountObject = account.toObject();
            accountObject.balance = accountObject.balanceCents / 100;
            delete accountObject.balanceCents;
            return accountObject;
        });

        return formattedAccounts;
    },
    async getOne(accountId) {
        const account = await Account.findById(accountId);

        if (!account) {
            return null
        }

        const accountObject = account.toObject();
        accountObject.balance = accountObject.balanceCents / 100;
        delete accountObject.balanceCents;
        return accountObject;
    },
    async create({ name, ownerId, currency, startingBalanceCents = 0 }) {
        const session = await mongoose.startSession()
        session.startTransaction()

        try {
            const [account] = await Account.create([{ name, ownerId, currency, balanceCents: 0 }], { session })

            if (startingBalanceCents !== 0)
                await Transaction.create([{
                    title: "Opening Balance",
                    ownerId,
                    accountId: account._id,
                    type: startingBalanceCents > 0 ? 'income' : 'expenses',
                    amountCents: Math.abs(startingBalanceCents),
                    category: "Other",
                    note: "Initial account balance",
                    isOpeningBalance: true,
                    date: new Date()
                }], { session });

            await Account.findByIdAndUpdate(account._id, { $inc: { balanceCents: startingBalanceCents } }, { session });

            await session.commitTransaction()

            const accountObject = account.toObject();
            accountObject.balance = accountObject.balanceCents / 100;
            delete accountObject.balanceCents;
            return accountObject;
        } catch (err) {
            await session.abortTransaction()
            throw err
        } finally {
            session.endSession()
        }

    },
    async update(accountId, accountData) {
        const account = await Account.findByIdAndUpdate(accountId, accountData, { new: true });

        if (!account) {
            return null
        }

        const accountObject = account.toObject();
        accountObject.balance = accountObject.balanceCents / 100;
        delete accountObject.balanceCents;
        return accountObject;
    }
}

export default accountService