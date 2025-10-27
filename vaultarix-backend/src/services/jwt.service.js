import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

const NODE_ENV = process.env.NODE_ENV || 'development';
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '15m';

let PRIVATE_KEY, PUBLIC_KEY, SIGN_OPTIONS;

if (NODE_ENV === 'production') {
  // RS256 con llaves PEM
  const privatePath = process.env.JWT_PRIVATE_KEY_PATH || '../vaultarix-backend/src/config/keys/private.pem';
  const publicPath = process.env.JWT_PUBLIC_KEY_PATH || '../vaultarix-backend/src/config/keys/public.pem';
  PRIVATE_KEY = fs.readFileSync(path.resolve(privatePath), 'utf8');
  PUBLIC_KEY = fs.readFileSync(path.resolve(publicPath), 'utf8');
  SIGN_OPTIONS = { algorithm: 'RS256', expiresIn: ACCESS_TOKEN_EXPIRY };
} else {
  // Dev: HS256 con secret simple
  PRIVATE_KEY = process.env.DEV_JWT_SECRET || 'dev_secret';
  PUBLIC_KEY = PRIVATE_KEY; // para HS256 se usa el mismo secret
  SIGN_OPTIONS = { algorithm: 'HS256', expiresIn: ACCESS_TOKEN_EXPIRY };
}

export const generateAccessToken = (user) => {
  if (!PRIVATE_KEY) throw new Error('Private key unavailable for signing');
  const payload = { sub: user.id, role: user.role || 'user' };
  return jwt.sign(payload, PRIVATE_KEY, SIGN_OPTIONS);
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
