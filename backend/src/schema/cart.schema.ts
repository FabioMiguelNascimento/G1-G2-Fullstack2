import z from 'zod'

export const addProductToCartSchema = z.object({
        title: z.string().min(2, "Título do produto precisa ser pelo menos 2 caracteres").max(255, "Título muito longo"),
        price: z.number().min(0.02, "Preço precisa ser pelo menos 0.02"),
        totalPrice: z.number().min(0.02, "Preço precisa ser pelo menos 0.02"),
        quantity: z.number().min(1).max(100)
})

export type AddProductToCartInput = z.infer<typeof addProductToCartSchema>

export const addProductsToCartSchma = z.array(addProductToCartSchema)

export type AddProductsToCartInput = z.infer<typeof addProductsToCartSchma>