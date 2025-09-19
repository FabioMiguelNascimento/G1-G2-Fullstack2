import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
    ChevronsUpDown,
    Heart,
    LogOut,
    MenuIcon,
    Package,
    ShoppingCart,
    User,
} from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import CartSheet from "./CartSheet";
import { Avatar, AvatarFallback } from "./ui/avatar";
import type UserType from "@/types/user.type";
import { useState } from "react";
import { Button } from "./ui/button";

export default function MobileMenu({ user }: { user: UserType }) {
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

                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link
                                        to="/cart"
                                        className="block px-3 py-2 rounded text-white hover:text-black"
                                        onClick={() => setOpen(false)}
                                    >
                                        Carrinho
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem className="flex items-center gap-2 px-3 py-2 rounded text-white hover:text-black hover:bg-accent cursor-pointer">
                                <CartSheet />
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <div className="flex items-center gap-2 px-3 py-2 rounded text-white hover:text-black   hover:bg-accent cursor-pointer">
                                            <Avatar className="w-8 h-8">
                                                <AvatarFallback className="bg-blue-600 font-bold text-white text-sm text-bold">
                                                    {user.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm font-bold">
                                                {user.name}
                                            </span>
                                            <ChevronsUpDown
                                                height={18}
                                                width={18}
                                            />
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem
                                            asChild
                                            className="cursor-pointer"
                                        >
                                            <Link
                                                to="/account"
                                                onClick={() => setOpen(false)}
                                            >
                                                <User className="mr-2 h-4 w-4" />
                                                Minha conta
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            asChild
                                            className="cursor-pointer"
                                        >
                                            <Link
                                                to="/cart"
                                                onClick={() => setOpen(false)}
                                            >
                                                <ShoppingCart className="mr-2 h-4 w-4" />
                                                Meu carrinho
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            asChild
                                            className="cursor-pointer"
                                        >
                                            <Link
                                                to="/favorites"
                                                onClick={() => setOpen(false)}
                                            >
                                                <Heart className="mr-2 h-4 w-4" />
                                                Meus favoritos
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            asChild
                                            className="cursor-pointer"
                                        >
                                            <Link
                                                to="/orders"
                                                onClick={() => setOpen(false)}
                                            >
                                                <Package className="mr-2 h-4 w-4" />
                                                Meus pedidos
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="cursor-pointer">
                                            <LogOut
                                                className="mr-2 h-4 w-4"
                                                onClick={() => setOpen(false)}
                                            />
                                            Logout
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </SheetContent>
            </Sheet>
        </>
    );
}
