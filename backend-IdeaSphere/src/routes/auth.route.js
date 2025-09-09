import { Router } from 'express';
import passport from '../config/passportAuth.js';

const router = Router();

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'consent',      // ⚡ forces consent screen every time
    accessType: 'offline',  // optional, if you need refresh tokens
  })
);

// Step 2: Google callback (return full user object)
router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', (err, user) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Server error',
        error: err.message,
      });
    }
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Google login failed',
      });
    }

    console.log('user:', user);

    return res.status(200).json({
      success: true,
      message: 'Google login success',
      data: user,
    });
  })(req, res, next);
});

export default router;
