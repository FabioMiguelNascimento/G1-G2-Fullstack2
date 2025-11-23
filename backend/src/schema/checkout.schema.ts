import z from 'zod'

export const checkoutSchema = z.object({
    password: z.string().min(1, "Senha é obrigatória")
})

export type CheckoutInput = z.infer<typeof checkoutSchema>