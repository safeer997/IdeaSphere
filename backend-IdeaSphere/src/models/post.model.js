import mongoose, { Schema } from 'mongoose';

const postSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 280,
    },
    media: [
      {
        type: {
          type: String,
          enum: ['image', 'video', 'gif'],
          default: 'image',
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    likesCount: {
      type: Number,
      default: 0,
    },
    retweetsCount: {
      type: Number,
      default: 0,
    },
    repliesCount: {
      type: Number,
      default: 0,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    isReply: {
      type: Boolean,
      default: false,
    },
    parentPost: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      default: null,
    },
    isRetweet: {
      type: Boolean,
      default: false,
    },
    originalPost: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      default: null,
    },
  },
  { timestamps: true }
);

export const Post = mongoose.model('Post', postSchema);
