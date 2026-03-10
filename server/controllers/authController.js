import { Router } from "express";
import authService from "../services/authService.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { Account } from "../models/Account.js";

const authController = Router();

authController.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const result = await authService.register(username, email, password);

        await Account.create({
            name: "Bank",
            currency: "EUR",
            balance: 0,
            ownerId: result.payload._id
        })

        res.cookie("accessToken", result.token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 1000 * 60 * 30
        });

        res.json(result.payload);
    } catch (err) {
        console.log(err.message);
    }
});

authController.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await authService.login(email, password);

        res.cookie("accessToken", result.token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 1000 * 60 * 30
        });

        res.json(result.payload);
    } catch (err) {
        console.log(err.message);
    }
});

authController.get("/logout", async (req, res) => {
    // await authService.logout();

    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    });

    res.status(204).end();
})

authController.get("/me", authMiddleware, (req, res) => {
    const { _id, email, username } = req.user
    res.json({ _id, email, username });
});


export default authController