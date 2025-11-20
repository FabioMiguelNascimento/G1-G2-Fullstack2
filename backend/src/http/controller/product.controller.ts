import { NotFoundError } from "@/error/httpErros.js";
import { CreateProductInput, UpdateProducInput, getProductSchema } from "@/schema/product.schema.js";
import { NextFunction, Request, Response } from "express";
import ProductRepository from "../repository/product.repo.js";
import ProductResponse from "../views/product.view.js";

export default class ProductController {
    private repo: ProductRepository;
    private view: ProductResponse;

    constructor() {
        this.repo = new ProductRepository()
        this.view = new ProductResponse()
    }

    update = async (req:Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const editedProduct: UpdateProducInput = req.validatedData;

            const oldProduct = await this.repo.getById(id);

            if(!oldProduct) throw new NotFoundError('Produto não encontrado com esse ID')

            const newProductData = await this.repo.update(id, editedProduct);

            res.status(200).json(newProductData);
        } catch (error) {
            next(error)
        }
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data: CreateProductInput = req.validatedData
            const userId = req.userId

            const product = await this.repo.create(data, userId)

            res.status(201).json(this.view.create(product))
        } catch (err) {
            next(err)
        }
    }

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.validatedData

            const product = await this.repo.findByid(id)

            if(!product) {
                throw new NotFoundError('Produto nao encontrado')
            }

            await this.repo.delete(id)

            res.status(204).json()
        } catch (err) {
            next(err)
        }
    }

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filters = req.query;
            const products = await this.repo.getAll(filters);

            res.status(200).json(this.view.getAll(products))
        } catch (err) {
            next(err)
        }
    }

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.validatedData

            const product = await this.repo.getById(id)

            if (!product) {
                throw new NotFoundError('Produto nao encontrado')
            }
            
            res.status(200).json(this.view.getById(product))
        } catch (err) {
            next(err)
        }
    }
}