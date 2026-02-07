import { Transaction } from "../models/Transaction.js";

export const financeService = {
    async computeUserBalance(ownerId) {
        const incomeTransactions = await Transaction.find({ ownerId, type: "income" }, { amount: 1 });
        const expensesTransactions = await Transaction.find({ ownerId, type: "expenses" }, { amount: 1 });

        const totalIncome = incomeTransactions.reduce((acc, t) => acc + t.amount, 0)
        const totalExpenses = expensesTransactions.reduce((acc, t) => acc + t.amount, 0)

        return totalIncome - totalExpenses
    }
}