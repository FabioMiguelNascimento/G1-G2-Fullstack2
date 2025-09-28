import z from 'zod';
import { passwordSchema } from './auth.schema.ts';

export const updateSchema = z.object({
    name: z.string().min(1).optional(),
    email: z.email().optional(),
    password: passwordSchema.optional()
});

export type UpdateInput = z.infer<typeof updateSchema>

export const idSchema = z.object({
    id: z.string().min(1, "Id necessario no parametro")
})

const createUserSchema = z.object({
    name: z.string().min(1, "Nome e obrigatorio"),
    email: z.string().email("Email invalido"),
    password: passwordSchema
});

export type CreateUserInput = z.infer<typeof createUserSchema>

const userSchema = createUserSchema.extend({
    id: z.string(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
})

export type UserSchema = z.infer<typeof userSchema>
