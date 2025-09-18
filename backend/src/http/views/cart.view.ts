import { CartResponse } from "../interface/cart.interface.js";

export default class CartView {
    getAll(data: CartResponse | null) {
        return { code: 200, message: "Produtos do carrinho listados com sucesso", data: data}
    }

    addProduct(data: CartResponse | null) {
        return { code: 201, message: "Produto adicionado com sucesso", data: data}
    }

    removeProduct(data: CartResponse | null) {
        return { code: 200, message: "Produto removido com sucesso", data: data}
    }
}