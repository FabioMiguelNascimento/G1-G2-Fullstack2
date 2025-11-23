import { Router } from "express";
import { authenticateToken } from "../../middleware/JWTauth.middleware.js";
import OrderController from "../controller/order.controller.js";

const router = Router();
const controller = new OrderController();

router.use(authenticateToken);
router.get("/", controller.getUserOrders);

export default router;