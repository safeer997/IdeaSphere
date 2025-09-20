import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { connectDb } from './config/db.js';
import session from 'express-session';
import passport from './config/passportAuth.js';
import cors from 'cors';

// routes
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';

const app = express();
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);

const PORT = process.env.PORT || 4000;
try {
  await connectDb();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
} catch (error) {
  console.log(error);
}
