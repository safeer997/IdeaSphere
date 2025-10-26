// routes/index.js
import { Router } from 'express';
import passport from '../config/passportAuth.js';
import { handleAuthCallback, logoutUser, getMe } from '../services/auth.service.js';
import { createUser } from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/verifyToken.middleware.js';

const router = Router();

// -------------------- User Signup --------------------
router.post('/signup', createUser);

// -------------------- Local Login --------------------
router.post('/login', handleAuthCallback('local'));

// -------------------- OAuth Routes --------------------
// Google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'consent',
    accessType: 'offline',
  })
);
router.get('/google/callback', handleAuthCallback('google'));

// GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', handleAuthCallback('github'));

// -------------------- Logout --------------------
router.post('/logout', logoutUser);

// -------------------- Get Current User --------------------
router.get('/me', verifyToken, getMe);

export default router;
