import bcrypt from 'bcryptjs';
import passport from '../config/passportAuth.js';
import jwt from 'jsonwebtoken';


export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(plainPassword, hashPassword) {
  return await bcrypt.compare(plainPassword, hashPassword);
}


function createToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
}

// Unified handler for Passport callbacks
export function handleAuthCallback(strategy) {
  return function (req, res, next) {
    passport.authenticate(strategy, async (err, user, info) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: `Server error during ${strategy} auth`,
          error: err.message,
        });
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: info?.message || 'Authentication failed',
        });
      }

      try {
        // Generate JWT
        const token = createToken(user);

        // Set JWT cookie
        res.cookie('token', token, {
          httpOnly: true,
          secure: false, // true in production with HTTPS
          sameSite: 'lax',
        });

        if (strategy === 'local') {
          // Local login: return JSON
          return res.status(200).json({
            success: true,
            message: 'Local Login successful',
            data: { id: user._id, email: user.email, name: user.username },
          });
        }

        // OAuth login: redirect to frontend dashboard
        return res.redirect('http://localhost:5173/dashboard');
      } catch (err) {
        return res.status(500).json({
          success: false,
          message: 'Token generation failed',
          error: err.message,
        });
      }
    })(req, res, next);
  };
}

// Logout: clear JWT cookie
export function logoutUser(req, res) {
  res.clearCookie('token');
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
}

// Get current user info (requires verifyToken middleware)
export function getMe(req, res) {
  return res.status(200).json({ success: true, user: req.user });
}
