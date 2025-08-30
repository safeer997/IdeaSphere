import mongoose from 'mongoose';

export async function connectDb() {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'IdeaSphere',
    });
    console.log(`✅ MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
}
