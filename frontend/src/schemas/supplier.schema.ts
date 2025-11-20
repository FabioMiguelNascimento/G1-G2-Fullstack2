import { z } from "zod";

export const createSupplierSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Endereço de email inválido.",
  }),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const updateSupplierSchema = createSupplierSchema.partial();

export const supplierSchema = createSupplierSchema.extend({
  id: z.string(),
});

export type Supplier = z.infer<typeof supplierSchema>;

