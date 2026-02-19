import { Account } from "../models/Account.js";
import { Transaction } from "../models/Transaction.js";

const accountService = {
    async getAccounts(filters) {
        return await Account.find(filters).explain("executionStats");
    },
    async getOne(accountId) {
        return await Account.findById(accountId)
    },
    async create(accountData) {
        return await Account.create(accountData)
    },
    async update(accountId, accountData) {
        return await Account.findByIdAndUpdate(accountId, accountData);
    },
    async delete(accountId) {
        return await Account.findByIdAndDelete(accountId);
    },
    async computeUserBalance(accountId) {
        // Account balance aggregation - Not in use

        const result = await Transaction.aggregate([
            { $match: { accountId } },
            {
                $group: {
                    _id: "$type",
                    total: { $sum: "$amount" }
                }
            }
        ])

        let income = 0;
        let expenses = 0;

        for (const entry of result) {
            if (entry._id === "income") {
                income = entry.total;
            }
            if (entry._id === "expenses") {
                expenses = entry.total;
            }
        }

        return income - expenses
    }
}

export default accountService