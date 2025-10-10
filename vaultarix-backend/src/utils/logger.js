/**
 * src/utils/logger.js
 * Instancia pino logger exportada para usar en otros módulos.
 */

import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: {
    paths: ['req.headers.authorization', 'res.headers'],
    remove: true
  }
});

export default logger;
