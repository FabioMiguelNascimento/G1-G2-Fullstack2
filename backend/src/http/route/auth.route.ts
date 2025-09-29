import AuthController from '@/http/controller/auth.controller.js'
import { validateBody } from '@/middleware/validateRequest.middleware.js'
import { loginSchema, registerSchema } from '@/schema/auth.schema.js'
import express from 'express'

const router = express.Router()
const authController = new AuthController()

router.post('/register', validateBody(registerSchema), authController.register)
router.post('/login', validateBody(loginSchema), authController.login)
router.post('/refresh', authController.refresh)
router.post('/logout', authController.logout)

export default router