import { Router } from "express";

import authController from "./controllers/authController.js";
import transactionController from "./controllers/transactionController.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";

const routes = Router();

routes.use("/auth", authController);
routes.use("/transactions", authMiddleware, transactionController);

export default routes