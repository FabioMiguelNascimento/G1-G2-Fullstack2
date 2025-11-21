import { createSupplierSchema, updateSupplierSchema } from "@/schema/supplier.schema.js";
import { Supplier } from "@prisma/client";
import { z } from "zod";

export interface ISupplier {
    create(supplier: z.infer<typeof createSupplierSchema>): Promise<Supplier>;
    getAll(): Promise<Supplier[]>;
    getById(id: string): Promise<Supplier | null>;
    update(id: string, supplier: z.infer<typeof updateSupplierSchema>): Promise<Supplier>;
    delete(id: string): Promise<Supplier>;
}
