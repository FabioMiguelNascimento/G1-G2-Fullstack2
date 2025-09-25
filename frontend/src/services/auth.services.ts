import type { User } from "@/types/user.type";
import api from "@/utils/api";

interface LoginRequest {
    password:  string,
    email: string,
}

interface LoginResponse {
    code: number;
    message: string;
    data: User
}

export const login = async ( data : LoginRequest ): Promise<LoginResponse['data'] | null> => {
    try {
        const response = await api.post<LoginResponse>('/auth/login', data);

        if (response.status >= 200 && response.status < 300) {
            return response.data.data;
        } else {
            console.error(`Falha no login, status: ${response.status}: ${response.data.message}`);
            return null;
        }
    } catch (error) {
        console.error('Login error:', error);
        return null;
    }
};