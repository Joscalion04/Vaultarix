import { hashPassword, verifyPassword } from '../crypto.service.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, revokeRefreshToken } from '../jwt.service.js';

const users = [
  { id: '1', username: 'admin', passwordHash: await hashPassword('admin123'), role: 'admin', permissions: ['read','write','delete'] },
  { id: '2', username: 'user', passwordHash: await hashPassword('user123'), role: 'user', permissions: ['read'] }
];

export const loginService = async (username, password) => {
  const user = users.find(u => u.username === username);
  if (!user) return null;
  const valid = await verifyPassword(user.passwordHash, password);
  if (!valid) return null;

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user.id);

  return { accessToken, refreshToken, user: { id: user.id, username: user.username, role: user.role, permissions: user.permissions } };
};

export const refreshTokenService = async (refreshToken) => {
  const userId = verifyRefreshToken(refreshToken);
  if (!userId) return null;

  revokeRefreshToken(refreshToken);

  const user = users.find(u => u.id === userId);
  if (!user) return null;

  const accessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user.id);

  return { accessToken, refreshToken: newRefreshToken, user: { id: user.id, username: user.username, role: user.role, permissions: user.permissions } };
};

export const logoutService = async (refreshToken) => {
  revokeRefreshToken(refreshToken);
  return true;
};

export const getUserByIdService = async (id) => users.find(u => u.id === id) || null;
