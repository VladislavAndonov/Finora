import { Router } from "express";
import authService from "../services/authService.js";

const authController = Router();

authController.post("/auth/register", async (req, res) => {
    const { username, email, password } = req.body

    const result = authService.register(username, email, password);

    // res.json(result)
});

authController.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;

    const result = authService.login(email, password);

    // res.json(result);
});

authController.post("/auth/logout", async (req, res) => {
    await authService.logout();

    res.status(204).end();
})



export default authController