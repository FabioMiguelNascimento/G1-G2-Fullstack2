import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class DashboardRepository {
    async getDashboardStats() {
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        const totalSales = await prisma.productInOrder.aggregate({
            _sum: {
                quantity: true,
            },
            where: {
                assignedAt: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                },
            },
        });

        const bestSellingProduct = await prisma.productInOrder.groupBy({
            by: ['productId'],
            _sum: {
                quantity: true,
            },
            where: {
                assignedAt: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                },
            },
            orderBy: {
                _sum: {
                    quantity: 'desc',
                },
            },
            take: 1,
        });

        let bestProduct: { id: string; title: string; price: number; totalSold: number } | null = null;
        if (bestSellingProduct.length > 0) {
            const product = await prisma.product.findUnique({
                where: { id: bestSellingProduct[0].productId },
                select: { id: true, title: true, price: true },
            });
            if (product && product.id && product.title && product.price !== undefined) {
                bestProduct = {
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    totalSold: bestSellingProduct[0]._sum.quantity || 0,
                };
            }
        }

        const lowStockProducts = await prisma.product.findMany({
            where: {
                stock: {
                    lt: 10,
                },
            },
            select: {
                id: true,
                title: true,
                stock: true,
                price: true,
            },
            orderBy: {
                stock: 'asc',
            },
            take: 10,
        });

        const recentOrders = await prisma.order.findMany({
            take: 5,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                product: {
                    include: {
                        product: true,
                    }
                }
            },
        });

        return {
            totalSales: totalSales._sum?.quantity || 0,
            bestSellingProduct: bestProduct,
            lowStockProducts,
            recentOrders: recentOrders.map(order => ({
                id: order.id,
                customer: order.user.name,
                date: order.createdAt,
                total: order.product.reduce((acc, item) => acc + (item.product.price * item.quantity), 0),
                status: "Concluído" // Por enquanto hardcoded, já que não temos status no model Order
            }))
        };
    }
}