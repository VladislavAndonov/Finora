import { Router } from "express";

import authController from "./controllers/authController.js";
import transactionController from "./controllers/transactionController.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import accountController from "./controllers/accountController.js";

const routes = Router();

routes.use("/auth", authController);
routes.use("/transactions", authMiddleware, transactionController);
routes.use("/accounts", authMiddleware, accountController)

export default routes