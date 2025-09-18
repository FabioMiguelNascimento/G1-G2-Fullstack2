import { NextFunction, Request, Response } from "express";
import CartRepository from "../repository/cart.repo.js";
import CartResponse from "../views/cart.view.js";
import { ProductCondition } from "@prisma/client";
import ProductController from "./product.controller.js";
import ProductResponse from "../views/product.view.js";
import ProductRepository from "../repository/product.repo.js";
import { NotFoundError } from "@/error/httpErros.js";
import { AddProductToCartInput } from "@/schema/cart.schema.js";

export default class CartController {
        private repo: CartRepository;
        private view: CartResponse;
        private productRepo: ProductRepository;
        private productView: ProductResponse;
    
        constructor() {
            this.repo = new CartRepository()
            this.view = new CartResponse()
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

                res.status(200).json(this.view.getAll(cart))
            } catch (err) {
                next(err)
            }
    }
}