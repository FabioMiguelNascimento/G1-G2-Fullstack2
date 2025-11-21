import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    MenuIcon
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import CartSheet from "./CartSheet";
import { Button } from "./ui/button";
import UserDropdownMenu from "./UserDropdownMenu";

export default function MobileMenu() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <MenuIcon className="text-white" />
                    </Button>
                </SheetTrigger>

                <SheetContent side="right">
                    <SheetHeader>
                        <SheetTitle>Menu de navegação</SheetTitle>
                        <SheetDescription>
                            Por aqui você pode navegar entre as páginas
                            principais da loja
                        </SheetDescription>
                    </SheetHeader>
                    <NavigationMenu className=" bg-blue-500">
                        <NavigationMenuList className="flex flex-col items-center space-x-6">
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link
                                        to="/"
                                        className="text-white font-medium hover:text-black"
                                        onClick={() => setOpen(false)}
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
                                        onClick={() => setOpen(false)}
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
                </SheetContent>
            </Sheet>
        </>
    );
}
