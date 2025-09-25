import { AuthContext } from "@/contexts/AuthProvider";
import { useContext } from "react";

export default function useAuthContext() {
    const context = useContext(AuthContext)

    if(!context) {
        throw new Error("Contexto precisa ser usado em um filho de AuthProvider")
    }

    return context
}