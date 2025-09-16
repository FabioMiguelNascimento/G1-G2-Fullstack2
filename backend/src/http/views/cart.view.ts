import { Cart } from "@prisma/client";

export default class CartResponse {
    getAll(data: Cart[]) {
        return { code: 200, message: "Produtos do carrinho listados com sucesso", data: data}
    }
}