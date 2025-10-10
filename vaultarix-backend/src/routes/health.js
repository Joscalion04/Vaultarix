/**
 * src/routes/health.js
 * Exporta router para /health
 *
 * No requiere autenticación (es público) pero:
 * - NO devuelve datos sensibles.
 * - Incluye token forense NO reversible (hash derivado) para correlación.
 */

import express from 'express';
import { getHealth } from '../controllers/healthController.js';

export const router = express.Router();

router.get('/', getHealth);

export default router;
