// server/db/db.js
// Zero-compile database layer built on Node's native `node:sqlite`.
// No native bindings, no build step — works anywhere Node 22.5+ runs.

import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'nuzio.db');

// Ensure the folder exists (matters if DB_PATH is overridden to a nested path)
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

export const db = new DatabaseSync(DB_PATH);

// Pragmas for sane concurrent read/write behaviour in dev + interview demos
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name          TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS profiles (
  id                 INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id            INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  language           TEXT DEFAULT 'en',
  location_enabled   INTEGER DEFAULT 0,
  city               TEXT,
  profession         TEXT,
  interests          TEXT DEFAULT '[]',   -- JSON array
  narrator_voice     TEXT DEFAULT 'Aria',
  brief_time         TEXT DEFAULT '07:00 AM',
  brief_length_min   INTEGER DEFAULT 5,
  notifications_on   INTEGER DEFAULT 0,
  onboarding_step    INTEGER DEFAULT 1,
  onboarding_done    INTEGER DEFAULT 0,
  plan               TEXT DEFAULT 'free', -- free | pro | pro_annual
  updated_at         TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS stories (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  summary       TEXT,
  category      TEXT,
  source        TEXT,
  audio_seconds INTEGER DEFAULT 0,
  is_saved      INTEGER DEFAULT 0,
  published_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
`);

// ---------- helpers ----------
const now = () => new Date().toISOString();

function run(sql, params = {}) {
  return db.prepare(sql).run(params);
}
function get(sql, params = {}) {
  return db.prepare(sql).get(params);
}
function all(sql, params = {}) {
  return db.prepare(sql).all(params);
}

// ---------- users ----------
export const Users = {
  create({ email, passwordHash, name }) {
    const info = run(
      `INSERT INTO users (email, password_hash, name) VALUES (:email, :passwordHash, :name)`,
      { email, passwordHash, name: name ?? null }
    );
    const user = get(`SELECT * FROM users WHERE id = :id`, { id: info.lastInsertRowid });
    run(`INSERT INTO profiles (user_id) VALUES (:userId)`, { userId: user.id });
    return user;
  },
  findByEmail(email) {
    return get(`SELECT * FROM users WHERE email = :email`, { email });
  },
  findById(id) {
    return get(`SELECT * FROM users WHERE id = :id`, { id });
  },
};

// ---------- profiles ----------
export const Profiles = {
  getByUserId(userId) {
    const row = get(`SELECT * FROM profiles WHERE user_id = :userId`, { userId });
    if (!row) return null;
    return { ...row, interests: JSON.parse(row.interests || '[]') };
  },
  update(userId, patch) {
    const current = Profiles.getByUserId(userId);
    if (!current) throw new Error('Profile not found');

    const merged = { ...current, ...patch };
    run(
      `UPDATE profiles SET
        language = :language,
        location_enabled = :locationEnabled,
        city = :city,
        profession = :profession,
        interests = :interests,
        narrator_voice = :narratorVoice,
        brief_time = :briefTime,
        brief_length_min = :briefLengthMin,
        notifications_on = :notificationsOn,
        onboarding_step = :onboardingStep,
        onboarding_done = :onboardingDone,
        plan = :plan,
        updated_at = :updatedAt
      WHERE user_id = :userId`,
      {
        userId,
        language: merged.language,
        locationEnabled: merged.location_enabled ?? merged.locationEnabled ? 1 : 0,
        city: merged.city ?? null,
        profession: merged.profession ?? null,
        interests: JSON.stringify(merged.interests ?? []),
        narratorVoice: merged.narrator_voice ?? merged.narratorVoice,
        briefTime: merged.brief_time ?? merged.briefTime,
        briefLengthMin: merged.brief_length_min ?? merged.briefLengthMin,
        notificationsOn: (merged.notifications_on ?? merged.notificationsOn) ? 1 : 0,
        onboardingStep: merged.onboarding_step ?? merged.onboardingStep,
        onboardingDone: (merged.onboarding_done ?? merged.onboardingDone) ? 1 : 0,
        plan: merged.plan,
        updatedAt: now(),
      }
    );
    return Profiles.getByUserId(userId);
  },
};

// ---------- stories ----------
export const Stories = {
  listForUser(userId, { category } = {}) {
    if (category && category !== 'All') {
      return all(
        `SELECT * FROM stories WHERE user_id = :userId AND category = :category ORDER BY published_at DESC`,
        { userId, category }
      );
    }
    return all(`SELECT * FROM stories WHERE user_id = :userId ORDER BY published_at DESC`, { userId });
  },
  create(userId, { title, summary, category, source, audioSeconds }) {
    const info = run(
      `INSERT INTO stories (user_id, title, summary, category, source, audio_seconds)
       VALUES (:userId, :title, :summary, :category, :source, :audioSeconds)`,
      { userId, title, summary: summary ?? null, category: category ?? null, source: source ?? null, audioSeconds: audioSeconds ?? 0 }
    );
    return get(`SELECT * FROM stories WHERE id = :id`, { id: info.lastInsertRowid });
  },
  replaceForUser(userId, stories, category) {
    const remove = category
      ? db.prepare('DELETE FROM stories WHERE user_id = ? AND category = ? AND is_saved = 0')
      : db.prepare('DELETE FROM stories WHERE user_id = ? AND is_saved = 0');
    if (category) remove.run(userId, category);
    else remove.run(userId);
    for (const story of stories) this.create(userId, story);
  },

  toggleSave(userId, storyId) {
    const story = get(`SELECT * FROM stories WHERE id = :id AND user_id = :userId`, { id: storyId, userId });
    if (!story) throw new Error('Story not found');
    run(`UPDATE stories SET is_saved = :val WHERE id = :id`, { id: storyId, val: story.is_saved ? 0 : 1 });
    return get(`SELECT * FROM stories WHERE id = :id`, { id: storyId });
  },
  saved(userId) {
    return all(`SELECT * FROM stories WHERE user_id = :userId AND is_saved = 1 ORDER BY published_at DESC`, { userId });
  },
};

// ---------- seed a few demo stories the first time a profile completes onboarding ----------
export function seedStoriesForUser(userId) {
  const existing = all(`SELECT id FROM stories WHERE user_id = :userId`, { userId });
  if (existing.length) return;
  const demo = [
    { title: 'Anthropic ships Claude 4.5 with 2M-token memory and native tools', category: 'AI & Tech', source: 'The Verge', audioSeconds: 210 },
    { title: 'Fed minutes hint at a September policy shift', category: 'Markets', source: 'Reuters', audioSeconds: 165 },
    { title: 'Indian startups raised $1.2B this week, led by fintech', category: 'Startups', source: 'Mint', audioSeconds: 140 },
    { title: 'Global chip supply eases as new fabs come online', category: 'AI & Tech', source: 'Bloomberg', audioSeconds: 190 },
    { title: 'Election watch: what changed in the polls this week', category: 'Global Politics', source: 'AP', audioSeconds: 175 },
  ];
  for (const s of demo) Stories.create(userId, s);
}

export default db;
