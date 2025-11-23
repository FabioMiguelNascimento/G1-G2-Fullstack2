import { Order } from "@prisma/client";
import prisma from "db/prisma.js";
import IOrder from "../interface/order.interface.js";

export default class OrderRepository implements IOrder {
    async getUserOrders(userId: string): Promise<Order[]> {
        return await prisma.order.findMany({
            where: { userId },
            include: {
                product: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
}