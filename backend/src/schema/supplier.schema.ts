import { z } from "zod";

export const createSupplierSchema = z.object({
    name: z.string().min(3),
    email: z.email(),
    phone: z.string().optional(),
    address: z.string().optional(),
});

export const updateSupplierSchema = z.object({
    name: z.string().min(3).optional(),
    email: z.email().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
});
