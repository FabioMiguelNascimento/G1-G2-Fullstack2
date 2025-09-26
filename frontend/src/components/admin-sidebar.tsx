"use client"

import {
  Tag,
  User,
  Package
} from "lucide-react"
import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import useAuthContext from "@/hooks/useAthContext"

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthContext()
  const data = {
    user: user,
    navMain: [
      {
        title: "Produtos",
        url: "produtos",
        icon: Package,
      },
      {
        title: "Usuários",
        url: "users",
        icon: User
      },
      {
        title: "Categorias",
        url: "categorias",
        icon: Tag
      }
    ],
  }
  return (
    <Sidebar collapsible="icon" {...props} className="mt-20">
      <SidebarHeader>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
