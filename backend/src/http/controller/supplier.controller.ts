import { Request, Response } from "express";
import supplierRepository from "../repository/supplier.repo.js";
import { createSupplierSchema, updateSupplierSchema } from "../../schema/supplier.schema.js";

class SupplierController {
    async createSupplier(req: Request, res: Response) {
        try {
            const supplierData = createSupplierSchema.parse(req.body);
            const supplier = await supplierRepository.create(supplierData);
            res.status(201).json(supplier);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async getAllSuppliers(req: Request, res: Response) {
        try {
            const suppliers = await supplierRepository.getAll();
            res.status(200).json(suppliers);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getSupplierById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const supplier = await supplierRepository.getById(id);
            if (!supplier) {
                return res.status(404).json({ message: "Supplier not found" });
            }
            res.status(200).json(supplier);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateSupplier(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const supplierData = updateSupplierSchema.parse(req.body);
            const supplier = await supplierRepository.update(id, supplierData);
            res.status(200).json(supplier);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async deleteSupplier(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await supplierRepository.delete(id);
            res.status(204).send();
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default new SupplierController();
