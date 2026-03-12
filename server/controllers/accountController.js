import { Router } from "express";
import accountService from "../services/accountService.js";
import AppError from "../errors/AppError.js";

const accountController = Router()

accountController.get("/", async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { isArchived } = req.query
        const filters = {}

        filters.ownerId = userId

        if (isArchived !== undefined) {
            filters.isArchived = isArchived === "true";
        }

        const accounts = await accountService.getAccounts(filters)

        res.json(accounts)

    } catch (err) {
        next(err)
    }
});

accountController.post("/", async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { name, currency, startingBalance } = req.body

        if (!name || !currency) {
            throw new AppError("Missing required account fields", 400);
        }

        const account = await accountService.create({ name, ownerId: userId, currency, startingBalanceCents: Math.round((startingBalance ?? 0) * 100) })

        res.status(201).json(account);

    } catch (err) {
        next(err)
    }
})

accountController.get("/:id", async (req, res, next) => {
    try {
        const userId = req.user._id;
        const account = await accountService.getOne(req.params.id);

        if (!account) {
            throw new AppError('Account not found', 404);
        }

        if (userId !== account.ownerId.toString()) {
            throw new AppError("Unauthorized", 403);
        }

        res.json(account)

    } catch (err) {
        next(err)
    }
})

accountController.put("/:id", async (req, res, next) => {
    try {
        const userId = req.user._id;
        const oldAccount = await accountService.getOne(req.params.id)

        if (!oldAccount) {
            throw new AppError('Account not found', 404);
        }

        if (userId !== oldAccount.ownerId.toString()) {
            throw new AppError("Unauthorized", 403);
        }

        const { name, currency, isArchived } = req.body

        const newAccount = await accountService.update(req.params.id, { name, ownerId: userId, currency, isArchived });

        res.json(newAccount);

    } catch (err) {
        next(err)
    }
})

export default accountController