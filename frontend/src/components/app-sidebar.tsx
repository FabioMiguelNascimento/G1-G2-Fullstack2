"use client";

import { Package, Shield, ShoppingCart, User as UserIcon } from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenuButton,
    SidebarRail,
    SidebarTrigger,
} from "@/components/ui/sidebar";

import useAuthContext from "@/hooks/useAthContext";
import type { User } from "@/types/user.type";
import { Link } from "react-router-dom";

const buildNavMain = (user: User | null) => [
  {
    title: "Minha conta",
    url: user ? `/account/${user.id}` : "/account/",
    icon: UserIcon,
  },
  {
    title: "Carrinho",
    url: user ? `/account/${user.id}/cart` : "/account/cart",
    icon: ShoppingCart,
  },
  {
    title: "Pedidos",
    url: "/account/orders",
    icon: Package,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, isAdmin } = useAuthContext();

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
      {isAdmin && (
        <SidebarFooter>
            <SidebarMenuButton asChild>
              <Link to="/admin/dashboard">
                <Shield />
                Area admin
              </Link>
            </SidebarMenuButton>
        </SidebarFooter>
      )}
      <SidebarRail />
    </Sidebar>
  );
}
