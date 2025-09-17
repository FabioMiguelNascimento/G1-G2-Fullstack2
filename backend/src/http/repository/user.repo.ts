import { User } from "@prisma/client";
import IUser from "../interface/user.interface.js";
import prisma from "db/prisma.js";
import { UserType } from "@/types/user.types.js";

export default class UserRepository implements IUser {
    async findUserById(id: string): Promise<UserType | null> {
        return await prisma.user.findUnique({where: {id: id}, include: {
            order: true,
            cart: true
        }});
    }

    async getAllUsers(): Promise<User[] | []> {
        return await prisma.user.findMany();
    }

    async deleteUser(id: string): Promise<void> {
        await prisma.$transaction([
            prisma.user.delete({where: {id: id}})
        ])
    }

    async updateUser(id: string, data: User): Promise<User | null> {
        return await prisma.user.update({where: {id: id}, data: data})
    }

}