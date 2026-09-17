import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { Users, Profiles } from '../db/db.js';
import { signToken, requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/register', (req, res) => {
  const { email, password, name } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  if (Users.findByEmail(email)) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const user = Users.create({ email, passwordHash, name });
  const token = signToken(user);
  const profile = Profiles.getByUserId(user.id);

  res.status(201).json({
    token,
    user: { id: user.id, email: user.email, name: user.name },
    profile,
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = Users.findByEmail(email);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = signToken(user);
  const profile = Profiles.getByUserId(user.id);
  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name },
    profile,
  });
});

router.get('/me', requireAuth, (req, res) => {
  const user = Users.findById(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const profile = Profiles.getByUserId(user.id);
  res.json({ user: { id: user.id, email: user.email, name: user.name }, profile });
});

export default router;
