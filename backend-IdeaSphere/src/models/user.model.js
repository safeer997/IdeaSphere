import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    googleId: {
      type: String,
    },
    avatar: {
      type: String,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
