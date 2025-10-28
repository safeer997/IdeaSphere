import { Follow } from '../models/follow.model.js';
import { User } from '../models/user.model.js';
import mongoose from 'mongoose';

export async function followUser(req, res) {
  const { userId } = req.params; 
  const followerId = req.user.id; 

  try {
   
    if (userId === followerId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow yourself',
      });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const existingFollow = await Follow.findOne({
      follower: followerId,
      following: userId,
    });

    if (existingFollow) {
      return res.status(400).json({
        success: false,
        message: 'You are already following this user',
      });
    }

    // Start a session for transaction , important for atomicity !!
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await Follow.create(
        [
          {
            follower: followerId,
            following: userId,
          },
        ],
        { session }
      );

      await User.findByIdAndUpdate(
        followerId,
        { $inc: { followingCount: 1 } },
        { session }
      );

      await User.findByIdAndUpdate(
        userId,
        { $inc: { followersCount: 1 } },
        { session }
      );

      await session.commitTransaction();

      return res.status(200).json({
        success: true,
        message: 'User followed successfully',
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error('Follow error:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while following user',
    });
  }
}

export async function unfollowUser(req, res) {
  const { userId } = req.params; 
  const followerId = req.user.id; 
  try {
    const followRelation = await Follow.findOne({
      follower: followerId,
      following: userId,
    });

    if (!followRelation) {
      return res.status(400).json({
        success: false,
        message: 'You are not following this user',
      });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

      await Follow.findByIdAndDelete(followRelation._id, { session });

      await User.findByIdAndUpdate(
        followerId,
        { $inc: { followingCount: -1 } },
        { session }
      );

      await User.findByIdAndUpdate(
        userId,
        { $inc: { followersCount: -1 } },
        { session }
      );

      await session.commitTransaction();

      return res.status(200).json({
        success: true,
        message: 'User unfollowed successfully',
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error('Unfollow error:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while unfollowing user',
    });
  }
}


export async function getFollowers(req, res) {
  const { userId } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  try {
    const skip = (page - 1) * limit;
    const followerDocs = await Follow.find({ following: userId })
      .populate(
        'follower',
        'username avatar bio isVerified followersCount followingCount'
      )
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    
    const followers = followerDocs.map(f => f.follower);

    
    const totalFollowers = await Follow.countDocuments({ following: userId });

    const pagination = {
      page,
      limit,
      total: totalFollowers,
      totalPages: Math.ceil(totalFollowers / limit),
    };

    return res.status(200).json({
      success: true,
      data: followers,
      pagination,
    });
  } catch (error) {
    console.error('Get followers error:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while fetching followers',
    });
  }
}


export async function getFollowing(req, res) {
  const { userId } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  try {
    const skip = (page - 1) * limit;

    const followingDocs = await Follow.find({ follower: userId })
      .populate(
        'following',
        'username avatar bio isVerified followersCount followingCount'
      )
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const following = followingDocs.map(f => f.following);

    const totalFollowing = await Follow.countDocuments({ follower: userId });

    const pagination = {
      page,
      limit,
      total: totalFollowing,
      totalPages: Math.ceil(totalFollowing / limit),
    };

    return res.status(200).json({
      success: true,
      data: following,
      pagination,
    });
  } catch (error) {
    console.error('Get following error:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while fetching following',
    });
  }
}


export async function checkFollowStatus(req, res) {
  const { userId } = req.params;
  const followerId = req.user.id;

  try {
    const isFollowing = await Follow.exists({
      follower: followerId,
      following: userId,
    });

    const data = { isFollowing: Boolean(isFollowing) };

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Check follow status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while checking follow status',
    });
  }
}
