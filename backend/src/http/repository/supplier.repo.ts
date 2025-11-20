import { PrismaClient, Supplier } from "@prisma/client";
import { ISupplier } from "../interface/supplier.interface";
import { createSupplierSchema, updateSupplierSchema } from "../../schema/supplier.schema";
import { z } from "zod";

const prisma = new PrismaClient();

class SupplierRepository implements ISupplier {
    async create(supplier: z.infer<typeof createSupplierSchema>): Promise<Supplier> {
        return prisma.supplier.create({ data: supplier });
    }

    async getAll(): Promise<Supplier[]> {
        return prisma.supplier.findMany();
    }

    async getById(id: string): Promise<Supplier | null> {
        return prisma.supplier.findUnique({ where: { id } });
    }

    async update(id: string, supplier: z.infer<typeof updateSupplierSchema>): Promise<Supplier> {
        return prisma.supplier.update({ where: { id }, data: supplier });
    }

    async delete(id: string): Promise<Supplier> {
        return prisma.supplier.delete({ where: { id } });
    }
}

export default new SupplierRepository();
