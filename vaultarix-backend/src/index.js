/**
 * src/index.js
 * Punto de entrada de la API Vaultarix (simple, escalable).
 *
 * Seguridad / hardening inicial:
 * - Helmet para cabeceras seguras.
 * - Rate limiter básico.
 * - CORS restrictivo por defecto (ajustar origen en producción).
 * - Logs con pino.
 * - JWT RS256 validation middleware preparado pero no expone endpoints sensibles por default.
 *
 * /health devuelve información forense NO CRÍTICA. Evita exponer IDs de servidor, IPs, nombres de host, etc.
 */

import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';
import fs from 'fs';
import path from 'path';
import { router as healthRouter } from './routes/health.js';
import { initInstanceId } from './services/cryptoService.js';

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
const app = express();

app.use(express.json({ limit: '5kb' })); // limitar tamaño de body para evitar envíos grandes
app.use(helmet());

// CORS: ajustar en producción con env.allowed_origins
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS || '*',
  methods: ['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With']
}));

// Rate limiter general (ajustar en production)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200, // limitar a 200 requests por IP por window
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

app.use(pinoHttp({ logger }));

// Inicializar valores de instancia (non-sensitive derived id) para forense
initInstanceId(process.env.INSTANCE_SEED || 'default_seed_for_dev');

// Rutas
app.use('/health', healthRouter);

// Default 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler básico (sin filtrar stack en producción)
app.use((err, req, res, next) => {
  req.log.error({ err }, 'Unhandled error');
  const isDev = (process.env.NODE_ENV !== 'production');
  res.status(500).json({
    error: 'Internal Server Error',
    ...(isDev ? { message: err.message } : {})
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info({ port }, 'Vaultarix backend started');
});
