import { Cart, Product } from "@prisma/client";

export default interface ICart {
    getAll(id: string): Promise<Cart | null>
    addProduct(product: Product, quantity: number, userId: string): Promise<Cart | null>
}