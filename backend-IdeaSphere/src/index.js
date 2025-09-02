import express from 'express';
import dotenv from 'dotenv';
import { connectDb } from './config/db.js';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4000;

try {  
  await connectDb();
  app.listen(PORT, () => {
    console.log(`Server running on port:${PORT}`);
  });
} catch (error) {
  console.log(error);
}
