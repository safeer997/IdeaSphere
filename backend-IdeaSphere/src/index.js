import express from 'express';
import dotenv from 'dotenv';
import { connectDb } from './config/db.js';
//routes
import userRoutes from './routes/user.route.js';
import passport from 'passport';
import session from "express"

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());


//routes
app.use('/api/v1/users', userRoutes);

const PORT = process.env.PORT || 4000;
try {
  await connectDb();
  app.listen(PORT, () => {
    console.log(`Server running on port:${PORT}`);
  });
} catch (error) {
  console.log(error);
}
