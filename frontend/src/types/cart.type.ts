export interface CartItem {
    id: string,
    product: {
        id: string,
        name: string,
        image: string,
        price: number
    },
    quantity: number,
    price: number
}