import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from "@/components/ui/navigation-menu"
import { Link } from "react-router-dom"
import CartSheet from "./CartSheet"
import UserDropdownMenu from "./UserDropdownMenu"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-blue-500 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="text-2xl font-bold text-white hover:text-blue-200">
          OsGuriShop
        </Link>

        <NavigationMenu>
          <NavigationMenuList className="flex items-center space-x-6">

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/"
                  className="text-white font-medium hover:text-black"
                >
                  Home
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/products"
                  className="block px-3 py-2 rounded text-white hover:text-black"
                >
                  Produtos
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/cart"
                  className="block px-3 py-2 rounded text-white hover:text-black"
                >
                  Carrinho
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem className="flex items-center gap-2 px-3 py-2 rounded text-white hover:text-black hover:bg-accent cursor-pointer">
              <CartSheet />
            </NavigationMenuItem>

            <NavigationMenuItem>
              <UserDropdownMenu />
            </NavigationMenuItem>

          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  )
}
