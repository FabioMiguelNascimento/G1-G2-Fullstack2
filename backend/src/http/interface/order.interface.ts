import { Order } from "@prisma/client";

export default interface IOrder {
    getUserOrders(userId: string): Promise<Order[]>;
}