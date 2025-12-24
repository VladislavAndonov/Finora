import { Router } from "express";
import authService from "../service/authService.js";

const authController = Router();

authController.post("/auth/register", async (req, res) => {
    const user = authService.register(username, email, password);

    const { username, email, password } = req.body

    console.log(username, email, password);
})



authController.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    hashFunc(password);

    res.redirect("/");
});



export default authController