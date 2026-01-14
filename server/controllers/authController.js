import { Router } from "express";
import authService from "../services/authService.js";

const authController = Router();

authController.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const result = await authService.register(username, email, password);

        res.cookie("accessToken", result.token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
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
            sameSite: "strict",
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
        sameSite: 'strict'
    });

    res.status(204).end();
})



export default authController