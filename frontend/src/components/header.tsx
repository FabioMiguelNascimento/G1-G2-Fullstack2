import { Link } from "react-router-dom";
import DesktopMenu from "./desktopMenu";
import MobileMenu from "./mobileMenu";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Header() {
    const user = {
        name: "John Doe",
        email: "john.doe@example.com",
    };

    const isMobile = useIsMobile();

    return (
        <header className="sticky top-0 z-50 w-full bg-blue-500 shadow-md">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                <Link
                    to="/"
                    className="text-2xl font-bold text-white hover:text-blue-200"
                >
                    OsGuriShop
                </Link>
                {isMobile ? (
                    <MobileMenu user={user} />
                ) : (
                    <DesktopMenu user={user} />
                )}
            </div>
        </header>
    );
}
