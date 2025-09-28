"use client";

import { Star, User as UserIcon } from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    SidebarTrigger,
} from "@/components/ui/sidebar";

import useAuthContext from "@/hooks/useAthContext";
import type { User } from "@/types/user.type";

const buildUserData = (user: User | null) => {
    if (user) {
        return {
            name: user.name,
            email: user.email,
            avatar: `/avatars/${user.name.charAt(0).toLowerCase()}.jpg`, // Avatar baseado na inicial
        };
    }
    return {
        name: "Usuário",
        email: "usuario@example.com",
        avatar: "/avatars/default.jpg",
    };
};

const buildNavMain = (user: User | null) => [
    {
        title: "Minha conta",
        url: user ? `/account/${user.id}` : "/account/",
        icon: UserIcon,
    },
    {
        title: "Favoritos",
        url: "/account/favorites",
        icon: Star,
    },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { user } = useAuthContext();
    
    // Estruturando os dados dinamicamente baseado no usuário logado
    const userData = buildUserData(user);
    const navMainItems = buildNavMain(user);
    
    return (
        <Sidebar collapsible="icon" {...props} className="pt-20">
            <SidebarHeader>
                <SidebarTrigger className="-ml-1" />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navMainItems} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={userData} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
