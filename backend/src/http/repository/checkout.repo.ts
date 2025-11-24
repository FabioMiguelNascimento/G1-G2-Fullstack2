import { BadRequestError, ConflictError, NotFoundError, UnauthorizedError } from "@/error/httpErros.js";
import { decodePassword } from "@/utils/bcrypt.js";
import { Order } from "@prisma/client";
import prisma from "db/prisma.js";
import ICheckout from "../interface/checkout.interface.js";

export default class CheckoutRepository implements ICheckout {
    async checkout(userId: string, password: string): Promise<Order & { product?: any[] }> {
        // Buscar usuário com carrinho
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                cart: {
                    include: {
                        product: {
                            include: {
                                product: true,
                            },
                        },
                    },
                },
            },
        });

        if (!user || !user.cart) {
            console.log("Usuário ou carrinho não encontrado");
            throw new NotFoundError("Usuário ou carrinho não encontrado");
        }

        // Validar senha
        console.log("Validando senha para usuário:", user.email);
        const isPasswordValid = decodePassword(user.password, password);
        if (!isPasswordValid) {
            console.log("Senha inválida");
            throw new UnauthorizedError("Senha incorreta");
        }

        // Verificar se carrinho tem produtos
        if (user.cart.product.length === 0) {
            console.log("Carrinho vazio");
            throw new BadRequestError("Carrinho vazio");
        }

        console.log(`Criando pedido para usuário ${userId} com ${user.cart.product.length} produtos`);

        // Verificar se todos os produtos existem e têm estoque
        const productIds = user.cart.product.map(item => item.productId);
        
        const existingProducts = await prisma.product.findMany({
            where: {
                id: {
                    in: productIds
                }
            }
        });

        if (existingProducts.length !== productIds.length) {
            const missingIds = productIds.filter(id => !existingProducts.some(p => p.id === id));
            console.log(`Produtos faltando: ${missingIds.join(', ')}`);
            throw new BadRequestError(`Produtos não encontrados: ${missingIds.join(', ')}`);
        }

        // Verificar se há produtos com estoque insuficiente
        const insufficientStock = user.cart.product.filter(cartItem => {
            const product = existingProducts.find(p => p.id === cartItem.productId);
            return !product || product.stock < cartItem.quantity;
        });

        if (insufficientStock.length > 0) {
            console.log("Produtos com estoque insuficiente:", insufficientStock);
            const productNames = insufficientStock.map(item => item.product.title).join(", ");
            throw new ConflictError(`Estoque insuficiente para: ${productNames}`);
        }

        let order: Order & { product?: any[] };

        // Usar transação para garantir atomicidade
        try {
            order = await prisma.$transaction(async (tx) => {
                // Criar pedido
                const newOrder = await tx.order.create({
                    data: {
                        name: `Pedido ${new Date().toISOString()}`,
                        userId: userId,
                        product: {
                            create: user.cart.product.map((item) => {
                                return {
                                    productId: item.productId,
                                    quantity: item.quantity,
                                    assignedBy: userId,
                                };
                            }),
                        },
                    },
                    include: {
                        product: {
                            include: {
                                product: true,
                            },
                        },
                    },
                });

                console.log(`Pedido criado com ID: ${newOrder.id}`);

                // Limpar carrinho
                await tx.productInCart.deleteMany({
                    where: { cartId: user.cart.id },
                });

                console.log("Carrinho limpo");

                // Resetar total do carrinho
                await tx.cart.update({
                    where: { id: user.cart.id },
                    data: { totalValue: "0" },
                });

                console.log("Total do carrinho resetado");

                return newOrder;
            });
        } catch (error) {
            console.error("Erro na transação:", error);
            throw error;
        }

        return order;
    }
}