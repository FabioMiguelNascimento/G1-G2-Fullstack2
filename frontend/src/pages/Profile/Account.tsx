import AccountSidebar from "@/components/AccountSidebar";
import { Outlet, useLocation } from "react-router-dom";

export default function Account() {
    const location = useLocation();
    
    // Função para determinar o nome da seção baseado no pathname
    const getSectionName = (pathname: string): string => {
        if (pathname === "/account" || pathname === "/account/") {
            return "Minha conta";
        }
        if (pathname.includes("/cart")) {
            return "Carrinho";
        }
        if (pathname.includes("/account/orders")) {
            return "Pedidos";
        }
        if (pathname.match(/^\/account\/[^/]+$/)) {
            return "Minha conta";
        }
        return "Perfil";
    };
    
    const sectionName = getSectionName(location.pathname);
    return (
        <>
            <AccountSidebar
                sectionContent={<Outlet />}
                sectionName={sectionName}
            />
        </>
    );
}
