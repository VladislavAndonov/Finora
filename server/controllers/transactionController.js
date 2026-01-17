import { Router } from "express";
import transactionService from "../services/transactionService.js";

const transactionController = Router();

transactionController.get("/", async (req, res) => {
    const user = req.user._id;
    const transactions = await transactionService.getAll(user);

    res.json(transactions);
});

transactionController.get("/latest", async (req, res) => {
    const user = req.user._id;
    const transactions = await transactionService.getLatest(user);

    res.json(transactions);
})

transactionController.get("/expenses", async (req, res) => {
    const user = req.user._id;
    const expenses = await transactionService.getExpenses(user);

    res.json(expenses)
});

transactionController.get("/income", async (req, res) => {
    const user = req.user._id;
    const income = await transactionService.getIncome(user);

    res.json(income)
});

transactionController.post("/", async (req, res) => {
    const transaction = await transactionService.create(req.body);

    res.json(transaction);
});

transactionController.put("/:id", async (req, res) => {
    const transaction = await transactionService.update(req.params.id, req.body)

    res.json(transaction);
})

transactionController.delete("/:id", async (req, res) => {
    await transactionService.delete(req.params.id);

    res.status(204).end()
});

transactionController.get("/:id", async (req, res) => {
    const transaction = await transactionService.getOne(req.params.id);

    res.json(transaction);
})

export default transactionController;