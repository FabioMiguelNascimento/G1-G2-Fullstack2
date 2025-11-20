import { CreateProductInput, UpdateProducInput } from "@/schema/product.schema.js";
import { Product } from "@prisma/client";
import prisma from "db/prisma.js";
import IProduct from "../interface/product.interface.js";

export default class ProductRepository implements IProduct {
    async create(data: CreateProductInput, userId: string): Promise<Product> {
        const { supplierId, ...productData } = data;
        return await prisma.product.create({
            data: {
                ...productData,
                userId,
                supplier: supplierId ? { connect: { id: supplierId } } : undefined,
            }
        })
    }

    async findByid(id: string): Promise<Product | null> {
        return await prisma.product.findUnique({
            where: { id: id}
        })
    }


    async delete(id: string): Promise<void> {
        await prisma.$transaction([
            prisma.productInCart.deleteMany({
                where: { productId: id }
            }),
            prisma.product.delete({
                where: { id: id },  
            })
        ])
    }

    async getAll(filters?: any): Promise<Product[] | []> {
        if (!filters || Object.keys(filters).length === 0) {
            return await prisma.product.findMany();
        }

        const where: any = {};

        if (filters?.title) {
            where.title = {
                contains: filters.title
            };
        }

        if (filters?.minPrice) {
            where.price = {
                ...where.price,
                gte: parseFloat(filters.minPrice)
            };
        }

        if (filters?.maxPrice) {
            where.price = {
                ...where.price,
                lte: parseFloat(filters.maxPrice)
            };
        }

        if (filters?.condition) {
            where.condition = filters.condition;
        }

        if (filters?.inStock !== undefined) {
            where.inStock = filters.inStock === 'true';
        }

        if (filters?.isNew !== undefined) {
            where.isNew = filters.isNew === 'true';
        }

        if (filters?.supplierId) {
            where.supplierId = filters.supplierId;
        }

        return await prisma.product.findMany({
            where
        });
    }

    async getById(id: string): Promise<Product | null> {
        return await prisma.product.findUnique({where: {id : id}});
    }

    async update(id: string, data: UpdateProducInput): Promise<Product> {
        const { supplierId, ...productData } = data;
        return await prisma.product.update({
            where: { id: id },
            data: {
                ...productData,
                supplier: supplierId ? { connect: { id: supplierId } } : undefined,
            }
        })
    }
}