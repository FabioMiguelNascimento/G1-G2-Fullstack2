import { Outlet, useLocation } from "react-router-dom";
import AccountSidebar from "@/components/AccountSidebar";
import Header from "@/components/header";

const sectionNames: Record<string, string> = {
    "/account": "Perfil",
    "/account/favorites": "Favoritos",
};

export default function Account() {
    const location = useLocation();
    const sectionName = sectionNames[location.pathname] || "Minha conta";
    return (
        <>
            <AccountSidebar
                sectionContent={<Outlet />}
                sectionName={sectionName}
            />
        </>
    );
}
