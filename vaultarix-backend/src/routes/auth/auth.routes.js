import express from 'express';
import { login, me, refresh, logout } from '../../controllers/auth/auth.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

export const router = express.Router();

router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', authMiddleware, me);

export default router;
