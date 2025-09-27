import type { Column } from "@/components/data-table";
import DataTable from "@/components/data-table";
import { Input } from "@/components/ui/input";
import { useFetchUsers } from "@/hooks/useFetchUsers";
import type { User } from "@/types/user.type";
import { Search } from "lucide-react";

interface UsersProps {} 
export default function Users ( {}: UsersProps ) {
    const { users, error, loading } = useFetchUsers()
    const columns: Column<User>[] = [
        { key: 'id', header: 'ID' },
        { key: 'name', header: 'Nome' },
        { key: 'email', header: 'Email' },
        { key: 'role', header: 'Função' }
    ];
    
        return (
            <div>
                <header>
                    <div className="relative w-full ">
                        <Input className="pl-8" placeholder="Procurar usuarios atuais" />
                        <Search className="absolute top-1/2 left-2 -translate-y-1/2 pointer-events-none" size={18} />
                    </div>
                </header>
                <div>
                   <DataTable data={users} columns={columns} isLoading={loading} onError={error} />
                </div>
            </div>
        )
}