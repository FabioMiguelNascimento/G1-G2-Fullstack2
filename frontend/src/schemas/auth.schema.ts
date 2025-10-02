import z from 'zod';


export const passwordSchema = z.string()
.min(8, { message: "A senha deve ter pelo menos 8 caracteres" })
.refine((password) => /[A-Z]/.test(password), { message: "A senha deve conter pelo menos uma letra maiúscula" })
.refine((password) => /[a-z]/.test(password), { message: "A senha deve conter pelo menos uma letra minúscula" })
.refine((password) => /[0-9]/.test(password), { message: "A senha deve conter pelo menos um número" })
.refine((password) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password), { message: "A senha deve conter pelo menos um caractere especial" });

export const optionalPasswordSchema = z.string()
.optional()
.refine((password) => {
    if (!password || password.trim() === "") return true;
    return password.length >= 8;
}, { message: "A senha deve ter pelo menos 8 caracteres" })
.refine((password) => {
    if (!password || password.trim() === "") return true;
    return /[A-Z]/.test(password);
}, { message: "A senha deve conter pelo menos uma letra maiúscula" })
.refine((password) => {
    if (!password || password.trim() === "") return true;
    return /[a-z]/.test(password);
}, { message: "A senha deve conter pelo menos uma letra minúscula" })
.refine((password) => {
    if (!password || password.trim() === "") return true;
    return /[0-9]/.test(password);
}, { message: "A senha deve conter pelo menos um número" })
.refine((password) => {
    if (!password || password.trim() === "") return true;
    return /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
}, { message: "A senha deve conter pelo menos um caractere especial" });

export const registerSchema = z.object({
    name: z.string().min(1, "Nome e obrigatorio"),
    email: z.email("Email e obrigatorio"),
    password: passwordSchema
})

export const loginSchema = z.object({
    email: z.email("Email e obrigatorio"),
    password: passwordSchema
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>