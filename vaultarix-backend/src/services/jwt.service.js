import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const NODE_ENV = process.env.NODE_ENV || 'development';
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '15m';
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';

let PRIVATE_KEY, PUBLIC_KEY, SIGN_OPTIONS;

if (NODE_ENV === 'production') {
  const privatePath = process.env.JWT_PRIVATE_KEY_PATH || './src/config/keys/private.pem';
  const publicPath = process.env.JWT_PUBLIC_KEY_PATH || './src/config/keys/public.pem';
  PRIVATE_KEY = fs.readFileSync(path.resolve(privatePath), 'utf8');
  PUBLIC_KEY = fs.readFileSync(path.resolve(publicPath), 'utf8');
  SIGN_OPTIONS = { algorithm: 'RS256', expiresIn: ACCESS_TOKEN_EXPIRY };
} else {
  PRIVATE_KEY = process.env.DEV_JWT_SECRET || 'dev_secret';
  PUBLIC_KEY = PRIVATE_KEY;
  SIGN_OPTIONS = { algorithm: 'HS256', expiresIn: ACCESS_TOKEN_EXPIRY };
}

const refreshTokenStore = new Map();

const hash = (str) => crypto.createHash('sha256').update(str).digest('hex');
function parseDuration(duration) {
  const match = /^(\d+)([smhd])$/.exec(duration);
  if (!match) throw new Error('Invalid duration format');
  const value = parseInt(match[1], 10);
  switch (match[2]) {
    case 's': return value * 1000;
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    default: throw new Error('Invalid duration unit');
  }
}

// Payload completo en access token
export const generateAccessToken = (user) => {
  if (!PRIVATE_KEY) throw new Error('Private key unavailable');

  const payload = {
    sub: user.id,
    username: user.username,
    role: user.role || 'user',
    permissions: user.permissions || []
  };

  // jwt.sign va a agregar automáticamente exp
  const token = jwt.sign(payload, PRIVATE_KEY, SIGN_OPTIONS);

  // Calculamos expiración real solo para mostrar en la respuesta
  const expiresInMs = parseDuration(ACCESS_TOKEN_EXPIRY);
  const expDate = new Date(Date.now() + expiresInMs);

  return { token, exp: expDate.toISOString() };
};


export const generateRefreshToken = (userId) => {
  const token = crypto.randomBytes(64).toString('hex');
  const expiresInMs = parseDuration(REFRESH_TOKEN_EXPIRY);
  const expiresAt = Date.now() + expiresInMs;
  refreshTokenStore.set(hash(token), { userId, expiresAt });
  return { token, exp: new Date(expiresAt).toISOString() };
};

export const verifyAccessToken = (token) => {
  return new Promise((resolve, reject) => {
    if (!PUBLIC_KEY) return reject(new Error('Public key unavailable'));
    jwt.verify(token, PUBLIC_KEY, SIGN_OPTIONS, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded);
    });
  });
};

export const verifyRefreshToken = (token) => {
  const data = refreshTokenStore.get(hash(token));
  if (!data) return null;
  if (data.expiresAt < Date.now()) {
    refreshTokenStore.delete(hash(token));
    return null;
  }
  return data.userId;
};

export const revokeRefreshToken = (token) => {
  refreshTokenStore.delete(hash(token));
};
