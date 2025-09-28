"use client";

import { User as UserIcon, ShoppingCart, Package } from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarRail,
    SidebarTrigger,
} from "@/components/ui/sidebar";

import useAuthContext from "@/hooks/useAthContext";
import type { User } from "@/types/user.type";

const buildNavMain = (user: User | null) => [
    {
        title: "Minha conta",
        url: user ? `/account/${user.id}` : "/account/",
        icon: UserIcon,
    },
    {
        title: "Carrinho",
        url: "/account/cart",
        icon: ShoppingCart,
    },
    {
        title: "Pedidos",
        url: "/account/orders",
        icon: Package,
    },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { user } = useAuthContext();
    
    // Estruturando os dados dinamicamente baseado no usuário logado
    const navMainItems = buildNavMain(user);
    
    return (
        <Sidebar collapsible="icon" {...props} className="pt-20">
            <SidebarHeader>
                <SidebarTrigger className="-ml-1" />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navMainItems} />
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
