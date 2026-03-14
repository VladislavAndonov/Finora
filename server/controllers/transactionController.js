import { Router } from "express";
import transactionService from "../services/transactionService.js";
import AppError from "../errors/AppError.js";

const transactionController = Router();

transactionController.get("/", async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { accountId, type, year, month, date, startDate, endDate, limit } = req.query;

        const filter = {
            ownerId: userId
        }

        if (accountId) {
            filter.accountId = accountId
        }

        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate)

            if (isNaN(start) || isNaN(end)) {
                throw new AppError("Invalid date range", 400);
            }

            end.setUTCDate(end.getUTCDate() + 1);

            filter.date = {
                $gte: start,
                $lt: end
            };
        }

        if (year && month) {
            const parsedYear = Number(year);
            const parsedMonth = Number(month);

            if (isNaN(parsedYear) || isNaN(parsedMonth)) {
                throw new AppError("Invalid year or month", 400);
            }

            let start;
            let end;

            if (date) {
                const parsedDate = Number(date)

                if (isNaN(parsedDate)) {
                    throw new AppError("Invalid date", 400);
                }

                start = new Date(Date.UTC(parsedYear, parsedMonth, parsedDate));
                end = new Date(Date.UTC(parsedYear, parsedMonth, parsedDate + 1));
            } else {
                start = new Date(Date.UTC(parsedYear, parsedMonth));
                end = new Date(Date.UTC(parsedYear, parsedMonth + 1));
            }

            filter.date = {
                $gte: start,
                $lt: end
            };
        }

        if (type) {
            const validTypes = ["income", "expenses"];

            if (!validTypes.includes(type)) {
                throw new AppError("Invalid transaction type", 400);
            }

            filter.type = type;
        }

        const transactions = await transactionService.getTransactions(filter, limit);
        res.json(transactions);

    } catch (err) {
        next(err)
    }
});

transactionController.post("/", async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { title, accountId, type, amount, date, category, note } = req.body

        if (!title || !accountId || !type || !amount || !date || !category) {
            throw new AppError("Missing required transaction fields", 400);
        }

        const transaction = await transactionService.create({ title, accountId, ownerId: userId, type, amountCents: Math.round(amount * 100), date, category, note });

        res.status(201).json(transaction);

    } catch (err) {
        next(err)
    }
});

transactionController.get("/:id", async (req, res, next) => {
    try {
        const transaction = await transactionService.getOne(req.params.id);
        const userId = req.user._id;

        if (!transaction) {
            throw new AppError('Transaction not found', 404);
        }

        if (userId !== transaction.ownerId.toString()) {
            throw new AppError("Unauthorized", 403);
        }

        res.json(transaction);

    } catch (err) {
        next(err)
    }
})

transactionController.put("/:id", async (req, res, next) => {
    try {
        const userId = req.user._id;

        const oldTransaction = await transactionService.getOne(req.params.id);

        if (!oldTransaction) {
            throw new AppError('Transaction not found', 404);
        }

        if (userId !== oldTransaction.ownerId.toString()) {
            throw new AppError("Unauthorized", 403);
        }

        const { title, accountId, type, amount, date, category, note } = req.body

        if (!title || !accountId || !type || !amount || !date || !category) {
            throw new AppError("Missing required transaction fields", 400);
        }

        const newTransaction = await transactionService.update(req.params.id, { title, accountId, ownerId: userId, type, amountCents: Math.round(amount * 100), date, category, note });

        res.json(newTransaction);

    } catch (err) {
        next(err)
    }
})

transactionController.delete("/:id", async (req, res, next) => {
    try {
        const userId = req.user._id;

        const transaction = await transactionService.getOne(req.params.id);

        if (!transaction) {
            throw new AppError('Transaction not found', 404);
        }

        if (userId !== transaction.ownerId.toString()) {
            throw new AppError("Unauthorized", 403);
        }

        await transactionService.delete(req.params.id);

        res.status(204).end()

    } catch (err) {
        next(err)
    }
});

export default transactionController;