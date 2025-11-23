import { Order } from "@prisma/client";

export default class OrderView {
    getUserOrders(orders: (Order & { product?: any[] })[]) {
        return {
            code: 200,
            message: "Pedidos encontrados com sucesso",
            data: orders.map(order => ({
                id: order.id,
                name: order.name,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
                products: order.product?.map((item: any) => ({
                    product: item.product,
                    quantity: item.quantity,
                    total: item.product.price * item.quantity
                })) || [],
                totalValue: order.product?.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0) || 0
            }))
        };
    }
}