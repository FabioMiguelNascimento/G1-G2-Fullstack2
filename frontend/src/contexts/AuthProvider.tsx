import { login, profile, register } from "@/services/auth.services";
import type { User } from "@/types/user.type";
import { createContext, useState, type ReactNode } from "react";

interface AuthContextType {
    user: User | null;
    login: (data: { email: string; password: string }) => Promise<User | null>;
    register: (data: { email: string; password: string; name: string }) => Promise<{ user: User | null, message: string }>;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const getInitialUser = (): User | null => {
        try {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch {
            localStorage.removeItem('user');
            return null;
        }
    };

    const [user, setUser] = useState<User | null>(getInitialUser);

    const loginHandler = async (data: { email: string; password: string }) => {
        const authedUser = await login(data);
        setUser(authedUser);
        
        if (authedUser) {
            localStorage.setItem('user', JSON.stringify(authedUser));
            const result = await profile();
            if (result.user) {
                setUser(result.user);
                localStorage.setItem('user', JSON.stringify(result.user));
            }
        }
        return authedUser;
    };

    const isAuthenticated = !!user;

    const isAdmin = user?.role === "ADMIN";


    const registerHandler = async (data: { email: string; password: string; name: string }): Promise<{ user: User | null, message: string }> => {
        return await register(data);
    };

    const logoutHandler = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const value = {
        user,
        login: loginHandler,
        register: registerHandler,
        logout: logoutHandler,
        isAuthenticated: isAuthenticated,
        isAdmin: isAdmin
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
