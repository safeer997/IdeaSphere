import dotenv from 'dotenv';
dotenv.config(); // load env immediately at the top to avpoid cliedid error from google
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { User } from '../models/user.model.js';
import { verifyPassword } from '../services/auth.service.js';

//Local startegy
passport.use(
  new LocalStrategy(
    { usernameField: 'identifier', passwordField: 'password' },
    async (identifier, password, done) => {
      try {
        let user = await User.findOne({ email: identifier.toLowerCase() });

        if (!user) {
          user = await User.findOne({ phoneNumber: identifier });
        }
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        const userPassword = user.password;

        const isMatch = await verifyPassword(password, userPassword);
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password' });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

//Google strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/v1/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            email: profile.emails?.[0]?.value,
            name: profile.displayName,
            avatar: profile.photos?.[0]?.value,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

//github startegy

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: '/api/v1/auth/github/callback',
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        let user = await User.findOne({ githubId: profile.id });
        if (!user) {
          user = await User.create({
            githubId: profile.id,
            email: profile.emails?.[0]?.value || null,
            name: profile.displayName || profile.username,
            avatar: profile.photos?.[0]?.value,
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (_id, done) => {
  try {
    const user = await User.findById(_id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
