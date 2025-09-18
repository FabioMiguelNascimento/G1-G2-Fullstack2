import { Cart, Product } from "@prisma/client";
import prisma from "db/prisma.js";
import ICart from "../interface/cart.interface.js";

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

    async addProduct(product: Product, quantity: number, userId: string): Promise<Cart | null> {
        const cart = await prisma.cart.findFirst({
            where: {
                user: {
                    id: userId
                }
            }
        });
        if (!cart) return null;

        const existing = await prisma.productInCart.findUnique({
            where: {
                productId_cartId: {
                    productId: product.id,
                    cartId: cart.id
                }
            }
        });

        if (existing) {
            return cart;
        }

        const newTotal = parseFloat(cart.totalValue) + product.price * quantity;
        return await prisma.cart.update({
            where: { id: cart.id },
            data: {
                totalValue: newTotal.toString(),
                product: {
                    upsert: {
                        where: {
                            productId_cartId: {
                                productId: product.id,
                                cartId: cart.id
                            }
                        },
                        update: {},
                        create: {
                            productId: product.id,
                            assignedBy: userId
                        }
                    }
                }
            }
        });
    }
}