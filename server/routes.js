import { Router } from "express";
import authController from "./controllers/authController.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";

const routes = Router();

routes.use("/auth", authController);

routes.use(authMiddleware);

routes.get("/", (req, res) => {

});

export default routes