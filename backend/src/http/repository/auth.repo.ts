import { RegisterInput } from '@/schema/auth.schema.js'
import { User } from '@prisma/client'
import prisma from '../../../db/prisma.js'
import IAuth from '../interface/auth.interface.js'

export default class AuthRepository implements IAuth {

    async findUserByEmail(email: string): Promise<User | null> {
        return await prisma.user.findUnique({where: {email: email}})
    }

    async findUserByRefreshToken(refreshToken: string): Promise<User | null> {
        return await prisma.user.findFirst({where: {refreshToken: refreshToken}})
    }

    async updateRefreshToken(userId: string, refreshToken: string | null): Promise<User> {
        return await prisma.user.update({
            where: {id: userId},
            data: {refreshToken}
        })
    }

    async register(userInput: RegisterInput): Promise<User> {
        const cart = await prisma.cart.create({
            data: {
                totalValue: "0",
            }
        })

        const user = await prisma.user.create({
            data: {
                ...userInput,
                cartId: cart.id
            },
            include: { cart: true}
        })

        return user
    }
}