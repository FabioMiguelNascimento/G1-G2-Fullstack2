export type UserRole = "ADMIN" | "USER" | "MEMBER"

export interface User {
    id: string,
    name: string,
    email: string,
    role: UserRole,
    token: string
}