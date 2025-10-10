/**
 * src/services/jwtService.js
 * Generación y verificación RS256.
 *
 * Lectura de llaves:
 * - Se recomienda montar llaves privadas y públicas como Docker secrets o en rutas fuera del repo.
 * - JWT_PRIVATE_KEY_PATH y JWT_PUBLIC_KEY_PATH deben apuntar a archivos PEM válidos.
 */

import fs from 'fs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

const getKey = (p) => {
  if (!p) return null;
  try {
    const resolved = path.resolve(p);
    return fs.readFileSync(resolved, 'utf8');
  } catch (err) {
    // no throw here; será manejado por la app
    return null;
  }
};

const PRIVATE_KEY = getKey(process.env.JWT_PRIVATE_KEY_PATH || './config/keys/private.pem');
const PUBLIC_KEY = getKey(process.env.JWT_PUBLIC_KEY_PATH || './config/keys/public.pem');

if (!PUBLIC_KEY || !PRIVATE_KEY) {
  // No rompemos startup pero dejamos un warning: en producción esto debería bloquear el arranque.
  console.warn('JWT keys not found. Set JWT_PRIVATE_KEY_PATH and JWT_PUBLIC_KEY_PATH (use docker secrets).');
}

const signOptions = {
  algorithm: 'RS256',
  expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m'
};

export const generateAccessToken = (user) => {
  if (!PRIVATE_KEY) throw new Error('Private key unavailable for signing');
  const payload = {
    sub: user.id,
    role: user.role || 'user'
  };
  return jwt.sign(payload, PRIVATE_KEY, signOptions);
};

export const verifyAccessToken = (token) => {
  return new Promise((resolve, reject) => {
    if (!PUBLIC_KEY) return reject(new Error('Public key unavailable'));
    jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded);
    });
  });
};
