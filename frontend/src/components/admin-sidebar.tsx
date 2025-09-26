import {
  Package,
  Tag,
  User
} from "lucide-react"
import * as React from "react"

import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const data = {
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
      }],
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
