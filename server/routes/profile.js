import { Router } from 'express';
import { Profiles, seedStoriesForUser } from '../db/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

// Fetch the current user's onboarding/profile state
router.get('/', (req, res) => {
  const profile = Profiles.getByUserId(req.userId);
  res.json({ profile });
});

// Partial update — each onboarding step PATCHes just its own fields
router.patch('/', (req, res) => {
  const patch = req.body || {};
  const profile = Profiles.update(req.userId, patch);

  if (profile.onboarding_done) {
    seedStoriesForUser(req.userId);
  }

  res.json({ profile });
});

// Explicit "complete onboarding" step
router.post('/complete', (req, res) => {
  const profile = Profiles.update(req.userId, { onboarding_done: true, onboarding_step: 8 });
  seedStoriesForUser(req.userId);
  res.json({ profile });
});

export default router;
