import { Router } from "express";
import { authenticateToken } from "../../middleware/JWTauth.middleware.js";
import { validateRequest } from "../../middleware/validateRequest.middleware.js";
import { checkoutSchema } from "../../schema/checkout.schema.js";
import CheckoutController from "../controller/checkout.controller.js";

const router = Router();
const controller = new CheckoutController();

router.use(authenticateToken);
router.post("/", validateRequest(checkoutSchema), controller.checkout);

export default router;