import { Router } from "express";
import { financeService } from "../services/financeService.js";

export const financeController = Router()

financeController.get("/balance", async (req, res) => {
    const userId = req.user._id;

    const balance = await financeService.computeUserBalance(userId);

    res.json(balance)
})