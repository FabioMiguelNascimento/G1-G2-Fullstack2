import { NextFunction, Request, Response } from "express";
import CartRepository from "../repository/cart.repo.js";
import CartResponse from "../views/cart.view.js";

export default class CartController {
        private repo: CartRepository;
        private view: CartResponse;
    
        constructor() {
            this.repo = new CartRepository()
            this.view = new CartResponse()
        }

        getAll = async (req: Request, res: Response, next: NextFunction) => {
            try {
                const userId = req.userId

                const cartProds = await this.repo.getAll(userId)

                res.status(200).json(this.view.getAll(cartProds))
            } catch (err) {
                next(err)
            }
        }
}