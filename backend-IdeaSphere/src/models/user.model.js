import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 3,
      maxlength: 30
    },
    phoneNumber: {
      type: String,
      trim: true,
      unique: true,
      sparse: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true
    },
    password: {
      type: String,
      minlength: 6,
      select: false
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true
    },
    githubId: {
      type: String,
      unique: true,
      sparse: true
    },
    avatar: {
      type: String,
      // default: 'https://via.placeholder.com/150'
    },
    bio: {
      type: String,
      maxlength: 160,
      default: ''
    },
    location: {
      type: String,
      maxlength: 50,
      default: ''
    },
    website: {
      type: String,
      maxlength: 100,
      default: ''
    },
    coverImage: {
      type: String,
      default: ''
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    followersCount: {
      type: Number,
      default: 0
    },
    followingCount: {
      type: Number,
      default: 0
    },
    postsCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
