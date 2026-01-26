import { Router } from "express";
import transactionService from "../services/transactionService.js";

const transactionController = Router();

transactionController.get("/", async (req, res) => {
    const userId = req.user._id;
    const { type, year, month, date, limit } = req.query;

    const filter = {
        ownerId: userId
    }

    if (date && year && month) {
        const parsedYear = Number(year);
        const parsedMonth = Number(month);
        const parsedDate = Number(date)

        const start = new Date(Date.UTC(parsedYear, parsedMonth, parsedDate));
        const end = new Date(Date.UTC(parsedYear, parsedMonth, parsedDate + 1));

        filter.date = {
            $gte: start,
            $lt: end
        };

    } else if (year && month) {
        const parsedYear = Number(year);
        const parsedMonth = Number(month);

        const start = new Date(Date.UTC(parsedYear, parsedMonth));
        const end = new Date(Date.UTC(parsedYear, parsedMonth + 1));

        filter.date = {
            $gte: start,
            $lt: end
        };
    }

    if (type) {
        filter.type = type;
    }

    const transactions = (await transactionService.getTransactions(filter, limit));

    res.json(transactions);
});

transactionController.get("/:id", async (req, res) => {
    const transaction = await transactionService.getOne(req.params.id);

    // TODO: Add validations? (if user is not an owner)

    res.json(transaction);
})

transactionController.post("/", async (req, res) => {
    const ownerId = req.user._id;
    const { title, type, amount, date, category } = req.body

    const transaction = await transactionService.create({ title, ownerId, type, amount, date, category });

    // TODO: Add validations

    res.json(transaction);
});

transactionController.put("/:id", async (req, res) => {
    const ownerId = req.user._id;
    const { title, type, amount, date, category } = req.body

    const transaction = await transactionService.update({ title, ownerId, type, amount, date, category });

    // TODO: Copy the validations from create

    res.json(transaction);
})

transactionController.delete("/:id", async (req, res) => {
    await transactionService.delete(req.params.id);

    res.status(204).end()
});

export default transactionController;