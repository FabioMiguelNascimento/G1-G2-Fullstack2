import { Cart, Order, User } from "@prisma/client";

export interface UserType extends User {
    order: Order[];
    cart: Cart
}