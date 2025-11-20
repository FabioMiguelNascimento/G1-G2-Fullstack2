import api from "@/utils/api";
import { z } from "zod";

const createSupplierSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    address: z.string().optional(),
});

const updateSupplierSchema = createSupplierSchema.partial();

export const getSuppliers = async () => {
    const response = await api.get("/supplier");
    return response.data;
};

export const getSupplierById = async (id: string) => {
    const response = await api.get(`/supplier/${id}`);
    return response.data;
};

export const createSupplier = async (supplier: z.infer<typeof createSupplierSchema>) => {
    const response = await api.post("/supplier", supplier);
    return response.data;
};

export const updateSupplier = async (id: string, supplier: z.infer<typeof updateSupplierSchema>) => {
    const response = await api.put(`/supplier/${id}`, supplier);
    return response.data;
};

export const deleteSupplier = async (id: string) => {
    const response = await api.delete(`/supplier/${id}`);
    return response.data;
};
