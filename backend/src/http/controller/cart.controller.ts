import { NotFoundError } from "@/error/httpErros.js";
import { AddProductToCartInput } from "@/schema/cart.schema.js";
import { NextFunction, Request, Response } from "express";
import CartRepository from "../repository/cart.repo.js";
import ProductRepository from "../repository/product.repo.js";
import CartView from "../views/cart.view.js";
import ProductResponse from "../views/product.view.js";

export default class CartController {
        private repo: CartRepository;
        private view: CartView;
        private productRepo: ProductRepository;
        private productView: ProductResponse;
    
        constructor() {
            this.repo = new CartRepository()
            this.view = new CartView()
            this.productRepo = new ProductRepository()
            this.productView = new ProductResponse()
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

        addProduct = async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { productId, quantity }: AddProductToCartInput = req.validatedData
                const userId = req.userId

                const product = await this.productRepo.getById(productId)

                if(!product) {
                    throw new NotFoundError("Produto nao encontrado")
                }

                const cart = await this.repo.addProduct(product, quantity, userId)

                res.status(200).json(this.view.addProduct(cart))
            } catch (err) {
                next(err)
            }
    }

    removeProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { productId } = req.params
            const userId = req.userId

            const cart = await this.repo.removeProduct(productId, userId)

            if (!cart) {
                throw new NotFoundError("Produto nao encontrado no carrinho")
            }

            res.status(200).json(this.view.removeProduct(cart))
        } catch (err) {
            next(err)
        }
    }

    updateQuantity = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { productId, quantity }: AddProductToCartInput = req.validatedData
            const userId = req.userId       

            const cart = await this.repo.updateQuantity(productId, quantity, userId)

            if (!cart) {
                throw new NotFoundError("Produto nao encontrado no carrinho")
            }

            res.status(200).json(this.view.updateQuantity(cart))
        } catch (err) {
            next(err)
        }
    }
}