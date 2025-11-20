import { UserRole } from "@prisma/client";
import { Router } from "express";
import { authenticateToken } from "../../middleware/JWTauth.middleware.js";
import { validatePermission } from "../../middleware/validatePermission.middleware.js";
import { validateRequest } from "../../middleware/validateRequest.middleware.js";
import { createSupplierSchema, updateSupplierSchema } from "../../schema/supplier.schema.js";
import supplierController from "../controller/supplier.controller.js";

const router = Router();

router.use(authenticateToken)

router.post("/", validatePermission([UserRole.ADMIN]), validateRequest(createSupplierSchema), supplierController.createSupplier);
router.get("/", supplierController.getAllSuppliers);
router.get("/:id", supplierController.getSupplierById);
router.put("/:id", validatePermission([UserRole.ADMIN]), validateRequest(updateSupplierSchema), supplierController.updateSupplier);
router.delete("/:id", validatePermission([UserRole.ADMIN]), supplierController.deleteSupplier);

export default router;
