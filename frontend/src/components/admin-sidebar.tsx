import {
    BarChart3,
    Package,
    ShoppingCart,
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
  const base = '/admin'
  const data = {
    navMain: [
      {
        title: "Dashboard",
        url: `${base}/dashboard`,
        icon: BarChart3,
      },
      {
        title: "Produtos",
        url: `${base}/produtos`,
        icon: Package,
      },
      {
        title: "Usuários",
        url: `${base}/users`,
        icon: User
      },
      {
        title: "Fornecedores",
        url: `${base}/suppliers`,
        icon: ShoppingCart
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
