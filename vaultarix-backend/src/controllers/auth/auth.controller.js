import { loginService, getUserByIdService } from '../../services/auth/auth.service.js';
import logger from '../../utils/logger.js';

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

    const result = await loginService(username, password);
    if (!result) return res.status(401).json({ error: 'Invalid credentials' });

    res.json(result);
  } catch (err) {
    logger.error({ err }, 'Login error');
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const me = async (req, res) => {
  try {
    const user = await getUserByIdService(req.user.sub);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ id: user.id, username: user.username, role: user.role });
  } catch (err) {
    logger.error({ err }, 'Get user info error');
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
