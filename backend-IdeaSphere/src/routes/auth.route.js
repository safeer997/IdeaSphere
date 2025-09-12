import { Router } from 'express';
import passport from '../config/passportAuth.js';
import { handleAuthCallback } from '../services/auth.service.js';

const router = Router();

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'consent',
    accessType: 'offline',
  })
);

router.get('/google/callback', handleAuthCallback('google'));

router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback', handleAuthCallback('github'));

router.post('/login', handleAuthCallback('local'));

export default router;
