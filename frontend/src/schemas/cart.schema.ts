import z from 'zod'

export const addProductToCartSchema = z.object({
        productId: z.string().min(1, "id do produto nao fornecido"),
        quantity: z.number().min(1).max(100).default(1)
})

export type AddProductToCartInput = z.infer<typeof addProductToCartSchema>

export const addProductsToCartSchma = z.array(addProductToCartSchema)

export type AddProductsToCartInput = z.infer<typeof addProductsToCartSchma>

export const removeProductFromCartSchema = z.object({
    productId: z.string().min(1, "id do produto nao fornecido")
})

export type RemoveProductFromCartInput = z.infer<typeof removeProductFromCartSchema>