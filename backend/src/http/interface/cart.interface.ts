import { Product } from "@prisma/client";

export interface CartItem {
    product: Product;
    quantity: number;
    total: number;
}

export interface CartResponse {
    products: CartItem[];
    totalCart: number;
}

export default interface ICart {
    getAll(id: string): Promise<CartResponse | null>;
    addProduct(product: Product, quantity: number, userId: string): Promise<CartResponse | null>;
    removeProduct(productId: string, userId: string): Promise<CartResponse | null>;
    updateQuantity(productId: string, quantity: number, userId: string): Promise<CartResponse | null>;
}