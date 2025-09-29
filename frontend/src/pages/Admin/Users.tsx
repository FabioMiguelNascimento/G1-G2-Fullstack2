import type { Column } from "@/components/data-table";
import DataTable from "@/components/data-table";
import SearchBar from "@/components/search-bar";
import { useFetchUsers } from "@/hooks/useFetchUsers";
import type { User } from "@/types/user.type";
import { useMemo, useState } from "react";

interface UsersProps {} 
export default function Users ( {}: UsersProps ) {
    const { users, error, loading } = useFetchUsers()
    const [searchTerm, setSearchTerm] = useState("");

    const filteredUsers = useMemo(() => {
        if (!searchTerm) return users;
        return users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    const columns: Column<User>[] = [
        { key: 'id', header: 'ID' },
        { key: 'name', header: 'Nome' },
        { key: 'email', header: 'Email' },
        { key: 'role', header: 'Função' }
    ];
    
        return (
            <div>
                <header>
                    <SearchBar
                        placeholder="Procurar usuarios atuais"
                        value={searchTerm}
                        onChange={setSearchTerm}
                    />
                </header>
                <div>
                   <DataTable data={filteredUsers} columns={columns} isLoading={loading} onError={error} />
                </div>
            </div>
        )
}