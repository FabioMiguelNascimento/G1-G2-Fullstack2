import type { User } from "@/types/user.type";
import api from "@/utils/api";

interface LoginRequest {
    password:  string,
    email: string,
}

interface RegisterRequest {
    password: string,
    email: string,
    name: string,
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

export const register = async ( data : RegisterRequest ): Promise<{ user: User | null, message: string }> => {
    try {
        console.log('Attempting register with:', data);
        const response = await api.post<LoginResponse>('/auth/register', data);
        console.log('Register response:', response);

        if (response.status >= 200 && response.status < 300) {
            return { user: response.data.data, message: '' };
        } 

        return { user: null, message: response.data.message || 'Erro no registro' };

    } catch (error: any) {
        console.error('Register error details:', error);
        if (error.response) {
            return { user: null, message: error.response.data.message || 'Erro no registro' };
        } else {
            return { user: null, message: 'Erro de rede' };
        }
    }
};

export const logout = async (): Promise<{ success: boolean, message: string }> => {
    try {
        const response = await api.post('/auth/logout');

        if (response.status >= 200 && response.status < 300) {
            return { success: true, message: 'Logout realizado com sucesso' };
        } else {
            return { success: false, message: response.data.message || 'Erro no logout' };
        }
    } catch (error: any) {
        console.error('Logout error:', error);
        return { success: true, message: 'Logout local realizado' };
    }
};

export const refreshToken = async (): Promise<{ success: boolean, message: string }> => {
    try {
        const response = await api.post('/auth/refresh');

        if (response.status >= 200 && response.status < 300) {
            return { success: true, message: 'Tokens renovados com sucesso' };
        } else {
            return { success: false, message: response.data.message || 'Erro ao renovar tokens' };
        }
    } catch (error: any) {
        console.error('Refresh token error:', error);
        return { success: false, message: error.response?.data?.message || 'Erro ao renovar tokens' };
    }
};

export const profile = async () => {
    try {
        const response = await api.get('/user/profile')

         if (response.status >= 200 && response.status < 300) {
            return { user: response.data.data, message: '' };
        } 

        return { user: null, message: response.data.message || 'Error ao autenticar' };
    } catch (error: any) {
         console.error('Profile error details:', error);
        if (error.response) {
            return { user: null, message: error.response.data.message || 'Erro ao buscar perfil' };
        } else {
            return { user: null, message: 'Erro de rede' };
        }
    }
}