import { UserRole } from "@prisma/client";

interface RegisterData {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

interface LoginData {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

export default class AuthResponse {
    register(data: RegisterData) {
        return {
            code: 201,
            message: "Registro feito com sucesso",
            data: { id: data.id, name: data.name, email: data.email, role: data.role }
        };
    }

    login(data: LoginData) {
        return {
            code: 200,
            message: "Login realizado com sucesso",
            data: { id: data.id, name: data.name, email: data.email, role: data.role },
        };
    }
}