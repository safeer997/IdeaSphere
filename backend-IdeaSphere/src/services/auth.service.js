import bcrypt from 'bcryptjs';
import passport from '../config/passportAuth.js';

export async function hashPassword(password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}

export async function verifyPassword(plainPassword, hashPassword) {
  const isMatch = await bcrypt.compare(plainPassword, hashPassword);
  return isMatch;
}

// callback handler for passport authentication
export function handleAuthCallback(strategy) {
  return function (req, res, next) {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: `Server error while ${strategy} auth`,
          error: err.message,
        });
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: info?.message || 'Authentication failed',
        });
      }

      return res.status(200).json({
        success: true,
        message: `${strategy} login success`,
        data: user,
      });
    })(req, res, next);
  };
}
