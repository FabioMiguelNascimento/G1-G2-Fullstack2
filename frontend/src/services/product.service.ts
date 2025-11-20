import { type Product } from "@/schemas/product.schema";
import api from "@/utils/api";

interface ProductListResponse {
    code: number;
    message: string;
    data: Product[];
}

export const getProductsBySupplierId = async (supplierId: string): Promise<Product[]> => {
    const response = await api.get<ProductListResponse>(`/product?supplierId=${supplierId}`);
    return response.data.data;
};
