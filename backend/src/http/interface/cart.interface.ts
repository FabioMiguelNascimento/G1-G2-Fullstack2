import { Cart } from "@prisma/client";

export default interface ICart {
    getAll(id: string): Promise<Cart | null>

}