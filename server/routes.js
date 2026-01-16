import { Router } from "express";
import authController from "./controllers/authController.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import transactionController from "./controllers/transactionController.js";

const routes = Router();

routes.use("/auth", authController);

routes.use("/transactions", transactionController);

routes.use(authMiddleware);



export default routes