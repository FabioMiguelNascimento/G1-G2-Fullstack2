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

export const registerWithConfirmSchema = z.object({
    name: z.string()
        .min(2, "Nome deve ter pelo menos 2 caracteres")
        .max(50, "Nome deve ter no máximo 50 caracteres"),
    email: z.string()
        .email("Email inválido"),
    password: z.string()
        .min(6, "Senha deve ter pelo menos 6 caracteres")
        .max(100, "Senha deve ter no máximo 100 caracteres")
        .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
        .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
        .regex(/\d/, "Senha deve conter pelo menos um número"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"]
})

export const loginSchema = z.object({
    email: z.string()
        .email("Email inválido"),
    password: z.string()
        .min(1, "Senha é obrigatória")
})

export type RegisterWithConfirmInput = z.infer<typeof registerWithConfirmSchema>
export type LoginInput = z.infer<typeof loginSchema>