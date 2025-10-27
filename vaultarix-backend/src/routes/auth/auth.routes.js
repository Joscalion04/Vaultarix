import express from 'express';
import { login, me } from '../../controllers/auth/auth.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

export const router = express.Router();

// Endpoint público: login
router.post('/login', login);

// Endpoint protegido: devuelve info del usuario
router.get('/me', authMiddleware, me);

export default router;
