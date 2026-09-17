import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import storyRoutes from './routes/stories.js';
import './db/db.js'; // ensures schema is created on boot

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true, db: 'node:sqlite' }));

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/stories', storyRoutes);

// 404 + error handling
app.use((req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Nuzio API running on http://localhost:${PORT} (node:sqlite, zero native compile)`);
});
