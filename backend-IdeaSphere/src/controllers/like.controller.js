import { Like } from '../models/like.model.js';
import { Post } from '../models/post.model.js';
import { User } from '../models/user.model.js';
import mongoose from 'mongoose';

// Like a post
export async function likePost(req, res) {
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if already liked
    const existingLike = await Like.findOne({
      user: userId,
      post: postId,
    });

    if (existingLike) {
      return res.status(400).json({
        success: false,
        message: 'You already liked this post',
      });
    }

    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create like
      await Like.create(
        [
          {
            user: userId,
            post: postId,
          },
        ],
        { session }
      );

      // Increment likesCount in Post
      await Post.findByIdAndUpdate(
        postId,
        { $inc: { likesCount: 1 } },
        { session }
      );

      await session.commitTransaction();

      return res.status(200).json({
        success: true,
        message: 'Post liked successfully',
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while liking post',
    });
  }
}

// Unlike a post
export async function unlikePost(req, res) {
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    // Check if like exists
    const likeRelation = await Like.findOne({
      user: userId,
      post: postId,
    });

    if (!likeRelation) {
      return res.status(400).json({
        success: false,
        message: 'You have not liked this post',
      });
    }

    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Delete like
      await Like.findByIdAndDelete(likeRelation._id, { session });

      // Decrement likesCount in Post
      await Post.findByIdAndUpdate(
        postId,
        { $inc: { likesCount: -1 } },
        { session }
      );

      await session.commitTransaction();

      return res.status(200).json({
        success: true,
        message: 'Post unliked successfully',
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while unliking post',
    });
  }
}

// Get posts liked by a user
export async function getUserLikes(req, res) {
  const { userId } = req.params;
  const currentUserId = req.user?.id;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  try {
    const skip = (page - 1) * limit;

    // Check if user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Find all likes by user and populate the post with user info
    const likeDocs = await Like.find({ user: userId })
      .populate({
        path: 'post',
        populate: {
          path: 'user',
          select: 'username avatar isVerified',
        },
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    // Get all liked post IDs by current user (if authenticated and different user)
    let currentUserLikedPostIds = [];
    if (currentUserId && currentUserId !== userId) {
      const likedDocs = await Like.find({ user: currentUserId }).select('post').lean();
      currentUserLikedPostIds = likedDocs.map(doc => doc.post.toString());
    }

    // Extract posts from likes and add liked status
    const likedPosts = likeDocs.map((like) => ({
      ...like.post,
      liked: userId === currentUserId ? true : currentUserLikedPostIds.includes(like.post._id.toString()),
    }));

    // Get total count
    const totalLikes = await Like.countDocuments({ user: userId });

    const pagination = {
      page,
      limit,
      total: totalLikes,
      pages: Math.ceil(totalLikes / limit),
    };

    return res.status(200).json({
      success: true,
      data: likedPosts,
      pagination,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while fetching liked posts',
    });
  }
}
