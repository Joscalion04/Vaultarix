import { loginService, getUserByIdService, refreshTokenService, logoutService } from '../../services/auth/auth.service.js';

export const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

  const result = await loginService(username, password);
  if (!result) return res.status(401).json({ error: 'Invalid credentials' });

  res.json({
    accessToken: result.accessToken.token,
    accessTokenExp: result.accessToken.exp,
    refreshToken: result.refreshToken.token,
    refreshTokenExp: result.refreshToken.exp,
    user: result.user
  });
};

export const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: 'Refresh token required' });

  const result = await refreshTokenService(refreshToken);
  if (!result) return res.status(401).json({ error: 'Invalid or expired refresh token' });

  res.json({
    accessToken: result.accessToken.token,
    accessTokenExp: result.accessToken.exp,
    refreshToken: result.refreshToken.token,
    refreshTokenExp: result.refreshToken.exp,
    user: result.user
  });
};

export const logout = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: 'Refresh token required' });

  await logoutService(refreshToken);
  res.json({ message: 'Logged out successfully' });
};

export const me = async (req, res) => {
  const user = await getUserByIdService(req.user.sub);
  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json({
    id: user.id,
    username: user.username,
    role: user.role,
    permissions: user.permissions
  });
};
