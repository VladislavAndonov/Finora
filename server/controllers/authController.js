import { Router } from "express";
import authService from "../services/authService.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import AppError from "../errors/AppError.js";

const authController = Router();

authController.post("/register", async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            throw new AppError("Missing required user fields", 400);
        }

        const result = await authService.register(username, email, password);

        res.cookie("accessToken", result.token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 1000 * 60 * 30
        });

        res.json(result.payload);

    } catch (err) {
        next(err)
    }
});

authController.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new AppError("Missing required user fields", 400);
        }

        const result = await authService.login(email, password);

        res.cookie("accessToken", result.token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 1000 * 60 * 30
        });

        res.json(result.payload);


    } catch (err) {
        next(err)
    }
});

authController.get("/logout", async (req, res) => {
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