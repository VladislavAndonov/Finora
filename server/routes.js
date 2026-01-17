import { Router } from "express";
import authController from "./controllers/authController.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import transactionController from "./controllers/transactionController.js";

const routes = Router();

routes.use("/auth", authController);

routes.use(authMiddleware);

routes.use("/transactions", transactionController);

export default routes