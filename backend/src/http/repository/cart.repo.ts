import { Cart, Product } from "@prisma/client";
import prisma from "db/prisma.js";
import ICart, { CartResponse } from "../interface/cart.interface.js";

export default class CartRepository implements ICart {
    // Método helper para calcular a resposta do carrinho
    private calculateCartResponse(cart: Cart & { product: { product: Product; quantity: number }[] }): CartResponse {
        const products = cart.product.map(item => ({
            product: item.product,
            quantity: item.quantity,
            total: item.product.price * item.quantity
        }));

        const totalCart = products.reduce((sum, item) => sum + item.total, 0);

        return {
            products,
            totalCart
        };
    }

    async getAll(id: string): Promise<CartResponse | null> {
        const cart = await prisma.cart.findFirst({
            where: {
                user: {
                    id: id
                }
            },
            include: {
                product: {
                    include: {
                        product: true
                    }
                }
            }
        });
        if (!cart) return null;

        return this.calculateCartResponse(cart);
    }


    async addProduct(product: Product, quantity: number, userId: string): Promise<CartResponse | null> {
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

        let updatedCart;
        if (existing) {
            const newQuantity = existing.quantity + quantity;
            const newTotal = parseFloat(cart.totalValue) + product.price * quantity;
            updatedCart = await prisma.cart.update({
                where: { id: cart.id },
                data: {
                    totalValue: newTotal.toString(),
                    product: {
                        update: {
                            where: {
                                productId_cartId: {
                                    productId: product.id,
                                    cartId: cart.id
                                }
                            },
                            data: {
                                quantity: newQuantity
                            }
                        }
                    }
                },
                include: {
                    product: {
                        include: {
                            product: true
                        }
                    }
                }
            });
        } else {
            const newTotal = parseFloat(cart.totalValue) + product.price * quantity;
            updatedCart = await prisma.cart.update({
                where: { id: cart.id },
                data: {
                    totalValue: newTotal.toString(),
                    product: {
                        create: {
                            productId: product.id,
                            assignedBy: userId,
                            quantity: quantity
                        }
                    }
                },
                include: {
                    product: {
                        include: {
                            product: true
                        }
                    }
                }
            });
        }

        return this.calculateCartResponse(updatedCart);
    }
}