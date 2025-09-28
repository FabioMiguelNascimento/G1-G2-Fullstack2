import { authenticateToken } from '@/middleware/JWTauth.middleware.js';
import { validatePermission } from '@/middleware/validatePermission.middleware.js';
import { validateBody, validateParams } from '@/middleware/validateRequest.middleware.js';
import { idSchema, updateSchema } from '@/schema/user.schema.js';
import express from 'express';
import UserController from '../controller/user.controller.js';

const router = express.Router();
const userController = new UserController();

router.use(authenticateToken);

// Rota para listar os dados do próprio usuário
router.get('/profile', userController.getSelfUserData);

// Rota pra listar os dados de um usuário por filtro (apenas admin)
router.get('/filter', validatePermission(['ADMIN']), userController.findUserByFilter);

// Rota para listar todos os usuários
router.get('/', validatePermission(['ADMIN']), userController.listAllUsers);

// Rota para editar os dados do próprio usuário
router.put('/', validateBody(updateSchema), userController.updateSelfUserData);

// Rota para usuário deletar seu próprio usuário
router.delete('/', userController.selfDeleteUserData);

// Rota para admin deletar usuário pelo id
router.delete('/:id', validatePermission(['ADMIN']), validateParams(idSchema), userController.deleteUserData);

export default router;