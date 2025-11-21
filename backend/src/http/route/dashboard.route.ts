import { authenticateToken } from '@/middleware/JWTauth.middleware.js'
import { validatePermission } from '@/middleware/validatePermission.middleware.js'
import express from 'express'
import DashboardController from '../controller/dashboard.controller.js'

const router = express.Router()

const dashboardController = new DashboardController()

router.use(authenticateToken, validatePermission(['ADMIN']))

router.get('/stats', dashboardController.getStats)

export default router