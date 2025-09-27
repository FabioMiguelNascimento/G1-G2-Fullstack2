import { Input } from "@/components/ui/input";
import { useFetchUsers } from "@/hooks/useFetchUsers";
import { Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface UsersProps {} 
export default function Users ( {}: UsersProps ) {
    const { users } = useFetchUsers()
        return (
            <div>
                <header>
                    <div className="relative w-full ">
                        <Input className="pl-8" placeholder="Procurar usuarios atuais" />
                        <Search className="absolute top-1/2 left-2 -translate-y-1/2 pointer-events-none" size={18} />
                    </div>
                </header>
                <div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users && users.length > 0 ? (
                                users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.name}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell>No users found</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        )
}