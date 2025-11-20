import { type Product } from "@/schemas/product.schema";
import api from "@/utils/api";

export const getProductsBySupplierId = async (supplierId: string): Promise<Product[]> => {
    const response = await api.get(`/product?supplierId=${supplierId}`);
    return response.data;
};
