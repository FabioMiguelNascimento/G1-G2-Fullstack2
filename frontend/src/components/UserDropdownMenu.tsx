import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import useAuthContext from "@/hooks/useAthContext";
import { ChevronsUpDown, Heart, LogOut, Package, ShoppingCart, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function UserDropdownMenu() {
    const { user, logout } = useAuthContext();
    return user ? (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 px-3 py-2 rounded text-white hover:text-black hover:bg-accent cursor-pointer">
                    <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-blue-600 font-bold text-white text-sm text-bold">
                            {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-bold">{user.name}</span>
                    <ChevronsUpDown height={18} width={18} />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to={`/account/${user.id}`}>
                        <User className="mr-2 h-4 w-4" />
                        Minha conta
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/cart">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Meu carrinho
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/favorites">
                        <Heart className="mr-2 h-4 w-4" />
                        Meus favoritos
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/orders">
                        <Package className="mr-2 h-4 w-4" />
                        Meus pedidos
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ) : (
        <Link to="/login">
            <Button>Fazer Login</Button>
        </Link>
    );
}