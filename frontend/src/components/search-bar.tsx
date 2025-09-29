import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    onSearch?: (value: string) => void;
}

export default function SearchBar({ placeholder = "Buscar...", value, onChange, onSearch }: SearchBarProps) {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && onSearch) {
            onSearch(value);
        }
    };

    return (
        <div className="relative w-full">
            <Input
                className="pl-8"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <Search className="absolute top-1/2 left-2 -translate-y-1/2 pointer-events-none" size={18} />
        </div>
    );
}