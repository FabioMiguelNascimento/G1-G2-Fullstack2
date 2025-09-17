import { UserType } from "@/types/user.types.js";
import { User } from "@prisma/client";

export default interface IUser {
    findUserById(id: string): Promise<UserType | null>
    getAllUsers(): Promise<User[] | []>
    deleteUser(id: string): Promise<void>
    updateUser(id: string, data: User): Promise<User | null>
}