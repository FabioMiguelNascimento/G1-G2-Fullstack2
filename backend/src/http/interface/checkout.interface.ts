import { Order } from "@prisma/client";

export default interface ICheckout {
    checkout(userId: string, password: string): Promise<Order & { product?: any[] }>;
}