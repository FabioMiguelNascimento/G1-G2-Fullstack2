import { CreateProductInput } from "@/schema/product.schema.js"
import { Product } from "@prisma/client"

export default class ProductResponse {
    create(data: Product) {
        return { code: 201, message: "Produto criado com sucesso", data: data}
    }

    getAll(data: Product[]) {
        return { code: 200, message: "Produtos listados com sucesso", data: data}
    }

    getById(data: Product) {
        return { code: 200, message: "Produto listado com sucesso", data: data}
    }
}