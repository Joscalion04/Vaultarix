/**
 * src/services/cryptoService.js
 * - Ejemplo de hashing con argon2
 * - Inicialización de instance id hash para correlación forense no reversible
 *
 * No guarda datos sensibles ni expone contraseñas.
 */

import argon2 from 'argon2';
import crypto from 'crypto';

let instanceSalt = null;

/**
 * initInstanceId(seed)
 * - Crea un salt aleatorio derivado de seed que se mantiene en memoria
 * - Se usa para generar un hash no reversible que se muestra en /health para correlación
 */
export const initInstanceId = (seed) => {
  // never store secrets in repo; seed debe venir de env o docker secret
  const seedBuf = Buffer.from(seed || crypto.randomBytes(16).toString('hex'));
  instanceSalt = crypto.createHash('sha256').update(seedBuf).digest();
};

export const getInstanceIdHash = () => {
  if (!instanceSalt) return null;
  // derivamos un valor no reversible del proceso actual
  const rnd = crypto.randomBytes(8);
  const combined = Buffer.concat([instanceSalt, rnd]);
  const hash = crypto.createHash('sha256').update(combined).digest('hex');
  // truncar para evitar exponer info larga
  return hash.slice(0, 16);
};

// Pass hashing helpers (argon2)
export const hashPassword = async (plain) => {
  return argon2.hash(plain, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16, // 64MB (ajustar según recursos)
    timeCost: 3,
    parallelism: 1
  });
};

export const verifyPassword = async (hash, plain) => {
  return argon2.verify(hash, plain);
};
