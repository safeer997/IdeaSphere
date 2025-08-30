import express from 'express';
import dotenv from "dotenv";
import {connectDb} from "./config/db.js"

dotenv.config();

const app = express();
app.use(express.json()); 


connectDb();


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


