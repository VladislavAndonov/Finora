import { Router } from "express";
import accountService from "../services/accountService.js";

const accountController = Router()

accountController.get("/", async (req, res) => {
    const userId = req.user._id;
    const { isArchived } = req.query
    const filters = {}

    filters.ownerId = userId

    if (isArchived === "true") {
        filters.isArchived = true
    } else {
        filters.isArchived = false
    }

    const accounts = await accountService.getAccounts(filters)

    res.json(accounts)
});

accountController.post("/", async (req, res) => {
    const userId = req.user._id;
    const { name, currency, startingBalance } = req.body

    const account = await accountService.create({ name, ownerId: userId, currency, startingBalance })

    res.json(account)
})

accountController.get("/:id", async (req, res) => {
    const userId = req.user._id;
    const account = await accountService.getOne({ _id: req.params.id, ownerId: userId });

    if (!account || userId !== account.ownerId.toString()) {
        return res.status(404).end()
    }

    res.json(account)
})

accountController.put("/:id", async (req, res) => {
    const userId = req.user._id;
    const { name, currency } = req.body

    const account = await accountService.update(req.params.id, { name, ownerId: userId, currency });

    res.json(account);
})

// TODO: Add account archiving

export default accountController