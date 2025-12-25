import { Router } from "express";
import authService from "../services/authService.js";

const authController = Router();

authController.post("/auth/register", async (req, res) => {
    const { username, email, password } = req.body

    authService.register(username, email, password);

    res.redirect("/");
});

authController.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;

    authService.login(email, password);

    res.redirect("/");
});



export default authController