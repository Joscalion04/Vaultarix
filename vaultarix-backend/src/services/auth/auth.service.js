import { hashPassword, verifyPassword } from '../crypto.service.js';
import { generateAccessToken } from '../jwt.service.js';

// Simulación de base de datos de usuarios para pruebas
const users = [
  {
    id: '1',
    username: 'admin',
    passwordHash: await hashPassword('admin123'), // cambiar en pruebas
    role: 'admin'
  },
  {
    id: '2',
    username: 'user',
    passwordHash: await hashPassword('user123'),
    role: 'user'
  }
];

export const loginService = async (username, password) => {
  const user = users.find(u => u.username === username);
  if (!user) return null;

  const valid = await verifyPassword(user.passwordHash, password);
  if (!valid) return null;

  const token = generateAccessToken(user);
  return { accessToken: token, user: { id: user.id, username: user.username, role: user.role } };
};

export const getUserByIdService = async (id) => {
  return users.find(u => u.id === id) || null;
};
