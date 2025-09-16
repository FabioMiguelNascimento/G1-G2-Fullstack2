import { Cart } from "@prisma/client";
import ICart from "../interface/cart.interface.js";
import prisma from "db/prisma.js";

export default class CartRepository implements ICart {
    async getAll(id: string): Promise<Cart | null> {
        return await prisma.cart.findFirst({
            where: {
                user: {
                    id: id
                }
            },
            include: {
                user: {
                    select: {
                        id: true
                    }
                }
            }
        });
    }
}