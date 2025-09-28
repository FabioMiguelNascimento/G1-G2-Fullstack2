import { authenticateToken } from '@/middleware/JWTauth.middleware.js'
import { validateBody } from '@/middleware/validateRequest.middleware.js'
import { addProductToCartSchema } from '@/schema/cart.schema.js'
import express from 'express'
import CartController from '../controller/cart.controller.js'

const router = express.Router()

const cartController = new CartController()

router.use(authenticateToken)

router.get('/', cartController.getAll)
router.post('/', validateBody(addProductToCartSchema), cartController.addProduct)
router.delete('/:productId', cartController.removeProduct)

export default router