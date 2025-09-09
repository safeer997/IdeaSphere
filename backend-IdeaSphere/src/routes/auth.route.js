import { Router } from 'express';
import passport from '../config/passportAuth.js';

const router = Router();

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'consent',     
    accessType: 'offline',  
  })
);

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
