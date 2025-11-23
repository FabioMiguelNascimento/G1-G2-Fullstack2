import { Order } from "@prisma/client";

export default class CheckoutView {
    checkout(order: Order & { product?: any[] }) {
        return {
            code: 200,
            message: "Compra finalizada com sucesso!",
            data: {
                orderId: order.id,
                orderName: order.name,
                createdAt: order.createdAt,
                productsCount: order.product?.length || 0
            }
        };
    }
}