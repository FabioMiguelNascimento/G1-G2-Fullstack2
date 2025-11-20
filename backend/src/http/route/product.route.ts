import { authenticateToken } from '@/middleware/JWTauth.middleware.js'
import { validatePermission } from '@/middleware/validatePermission.middleware.js'
import { validateBody, validateParams, validateRequest } from '@/middleware/validateRequest.middleware.js'
import { createProductSchema, deleteProductSchema, updateProductSchema, getProductSchema } from '@/schema/product.schema.js'
import express from 'express'
import ProductController from '../controller/product.controller.js'
import { idSchema } from '@/schema/utils/id.schema.js'

const router = express.Router()

const productController = new ProductController()

router.get('/', productController.getAll)
router.get('/:id', validateParams(idSchema), productController.getById)

router.use(authenticateToken, validatePermission(['ADMIN']))

router.post('/', validateBody(createProductSchema), productController.create)
router.put('/:id', validateBody(updateProductSchema), validateParams(idSchema), productController.update)
router.delete('/:id', validateParams(deleteProductSchema), productController.delete)

export default router