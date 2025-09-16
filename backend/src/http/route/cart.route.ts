import express from 'express'
import CartController from '../controller/cart.controller.js'
import { authenticateToken } from '@/middleware/JWTauth.middleware.js'

const router = express.Router()

const cartController = new CartController()

router.get('/', authenticateToken, cartController.getAll)

export default router