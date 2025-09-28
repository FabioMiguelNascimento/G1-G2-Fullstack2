import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import CartSheet from "./CartSheet";
import UserDropdownMenu from "./UserDropdownMenu";

export default function DesktopMenu () {
    return (
        <NavigationMenu className="justify-end">
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

                <NavigationMenuItem className="flex items-center gap-2 px-3 py-2 rounded text-white hover:text-black hover:bg-accent cursor-pointer">
                    <CartSheet />
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <UserDropdownMenu />
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
};