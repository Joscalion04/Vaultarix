/**
 * src/middlewares/authMiddleware.js
 * JWT RS256 verification middleware de ejemplo.
 *
 * No se aplica en /health por diseño. Este middleware es para futuros endpoints sensibles.
 *
 * Uso: app.use('/api', authMiddleware)
 */

import { verifyAccessToken } from '../services/jwtService.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = auth.split(' ')[1];
    const payload = await verifyAccessToken(token);
    // payload contiene id y role si se generó así
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
