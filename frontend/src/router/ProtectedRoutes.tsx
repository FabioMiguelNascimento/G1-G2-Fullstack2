import useAuthContext from "@/hooks/useAthContext";
import { Navigate, Outlet } from "react-router-dom";

export const AuthenticatedRoutes = () => {
    const { isAuthenticated } = useAuthContext();

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

export const AdminRoutes = () => {
    const { isAdmin } = useAuthContext();

    return isAdmin ? <Outlet /> : <Navigate to="/login" />;
}