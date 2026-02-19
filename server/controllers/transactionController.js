import { Router } from "express";
import transactionService from "../services/transactionService.js";

const transactionController = Router();

transactionController.get("/", async (req, res) => {
    const userId = req.user._id;
    const { account, type, year, month, date, startDate, endDate, limit } = req.query;

    const filter = {
        ownerId: userId
    }

    if (account) {
        filter.account = account
    }

    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate)

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
            return res.status(400).json({ message: "Invalid year or month" });
        }

        let start;
        let end;

        if (date) {
            const parsedDate = Number(date)

            if (isNaN(parsedDate)) {
                return res.status(400).json({ message: "Invalid date" });
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
        filter.type = type;
    }

    const transactions = await transactionService.getTransactions(filter, limit);

    res.json(transactions);
});

transactionController.post("/", async (req, res) => {
    const userId = req.user._id;
    const { title, type, amount, date, category } = req.body

    const transaction = await transactionService.create({ title, ownerId: userId, type, amount, date, category });

    res.json(transaction);
});

transactionController.get("/:id", async (req, res) => {
    const transaction = await transactionService.getOne(req.params.id);
    const userId = req.user._id;

    if (!transaction || userId !== transaction.ownerId.toString()) {
        return res.status(404).end()
    }

    res.json(transaction);
})

transactionController.put("/:id", async (req, res) => {
    const userId = req.user._id;
    const { title, type, amount, date, category } = req.body

    const transaction = await transactionService.update(req.params.id, { title, ownerId: userId, type, amount, date, category });

    res.json(transaction);
})

transactionController.delete("/:id", async (req, res) => {
    await transactionService.delete(req.params.id);

    res.status(204).end()
});

export default transactionController;