import type { User } from "@/types/user.type"

interface UsersTableProps {
    users: User[]
}

export default function UsersTable ( {users}: UsersTableProps ) {
        return (
            users.length > 0 ? (
                <div>Users exist</div>
            ) : (
                <div>No users</div>
            )
        )
}