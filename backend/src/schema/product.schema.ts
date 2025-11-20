import z from 'zod'

const ProductConditionEnum = z.enum(['PREMIUM', 'NEW', 'REFURBISHED', 'USED', 'DAMAGED'])
const WarrantyTypeEnum = z.enum(['MANUFACTURER', 'EXTENDED', 'REFURBISHED'])
const ShippingOptionEnum = z.enum(['FREE', 'PAID', 'EXPRESS'])
const ReturnPolicyEnum = z.enum(['DAYS_30', 'DAYS_60', 'NO_RETURN'])

export const createProductSchema = z.object({
    title: z.string().min(2, "Título do produto precisa ser pelo menos 2 caracteres").max(255, "Título muito longo"),
    description: z.string().min(2, "Descrição precisa ser pelo menos 2 caracteres").max(1000, "Descrição muito longa"),
    price: z.number().min(0.02, "Preço precisa ser pelo menos 0.02"),
    withoutDiscount: z.number().optional(),
    discountPercentage: z.number().min(0).max(100).optional(),
    rating: z.number().min(0).max(5).optional(),
    inStock: z.boolean().default(true),
    stock: z.number().min(0, "Stock deve ser maior ou igual a 0"),
    isNew: z.boolean().default(false),
    condition: ProductConditionEnum.default('NEW'),
    categorys: z.array(z.string()).optional(),
    specifications: z.array(z.object({
        name: z.string(),
        value: z.string(),
    })).optional(),
    mainFeatures: z.array(z.object({
        name: z.string(),
        value: z.string(),
    })).optional(),
    colors: z.array(z.string()).optional(),
    freeShipping: ShippingOptionEnum.default('FREE'),
    warranty: WarrantyTypeEnum.default('MANUFACTURER'),
    returnPolicy: ReturnPolicyEnum.default('DAYS_30'),
    includes: z.array(z.object({
        name: z.string(),
        value: z.string(),
    })).optional(),
    supplierId: z.string().optional(),
})

export type CreateProductInput = z.infer<typeof createProductSchema>

export const deleteProductSchema = z.object({
    id: z.string().min(1, "Id nao passado nos params")
})

export const updateProductSchema = createProductSchema.partial();

export type UpdateProducInput = z.infer<typeof updateProductSchema>