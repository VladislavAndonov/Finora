import { Router } from "express";
import authController from "./controllers/authController.js";

const routes = Router();

routes.use("/auth", authController);

routes.get("/", (req, res) => {

});


export default routes