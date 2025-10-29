import { Post } from '../models/post.model.js';
import { User } from '../models/user.model.js';
import { Like } from '../models/like.model.js';

export async function createPost(req, res) {
  const { content } = req.body;
  const userId = req.user.id;

  try {
    // Validate content
    if (!content || content.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Post content cannot be empty',
      });
    }

    if (content.length > 280) {
      return res.status(400).json({
        success: false,
        message: 'Post content cannot exceed 280 characters',
      });
    }

    // Build post data
    const postData = {
      user: userId,
      content: content.trim(),
      media: [],
    };

    // Handle uploaded file from multer
    if (req.file) {
      postData.media.push({
        type: 'image',
        url: req.file.path, // Cloudinary URL
      });
    }

    // Create post in database
    const createdPost = await Post.create(postData);

    if (!createdPost) {
      return res.status(500).json({
        success: false,
        message: 'Something went wrong while creating post',
      });
    }

    // Populate user details
    await createdPost.populate('user', 'username avatar isVerified');

    // Update user's posts count
    await User.findByIdAndUpdate(userId, { $inc: { postsCount: 1 } });

    // Add liked field (false for newly created post)
    const postWithLikeStatus = {
      ...createdPost.toObject(),
      liked: false,
    };

    return res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: postWithLikeStatus,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong while creating post',
    });
  }
}

export async function getPost(req, res) {
  const { postId } = req.params;
  const userId = req.user?.id;

  try {
    const post = await Post.findById(postId)
      .populate('user', 'username avatar bio isVerified')
      .populate({
        path: 'parentPost',
        populate: { path: 'user', select: 'username avatar isVerified' },
      })
      .populate({
        path: 'originalPost',
        populate: { path: 'user', select: 'username avatar isVerified' },
      });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if current user liked this post
    let liked = false;
    if (userId) {
      const likeExists = await Like.exists({ user: userId, post: postId });
      liked = !!likeExists;
    }

    const postWithLikeStatus = {
      ...post.toObject(),
      liked,
    };

    return res.status(200).json({
      success: true,
      data: postWithLikeStatus,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while fetching post',
    });
  }
}

export async function getAllPosts(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const userId = req.user?.id; 
    
    // console.log('Current user ID:', userId);
    // console.log('User object:', req.user);

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'username avatar isVerified')
      .lean();

    // Get all liked post IDs by current user (if authenticated)
    let likedPostIds = [];
    if (userId) {
      const likedDocs = await Like.find({ user: userId }).select('post').lean();
      console.log('Liked docs found:', likedDocs.length);
      console.log('Liked docs:', likedDocs);
      
      likedPostIds = likedDocs.map(doc => doc.post.toString());
      console.log('Liked post IDs:', likedPostIds);
    } else {
      console.log('No userId provided');
    }

    // Add liked field to each post
    const postsWithLikeStatus = posts.map(post => {
      const isLiked = likedPostIds.includes(post._id.toString());
      console.log(`Post ${post._id}: liked=${isLiked}`);
      return {
        ...post,
        liked: isLiked,
      };
    });

    const total = await Post.countDocuments();

    return res.status(200).json({
      success: true,
      data: postsWithLikeStatus,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while fetching posts',
    });
  }
}


export async function getUserPosts(req, res) {
  const { userId } = req.params;
  const currentUserId = req.user?.id; // Get current user ID if authenticated

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const posts = await Post.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'username avatar isVerified')
      .lean();

    // Get all liked post IDs by current user (if authenticated)
    let likedPostIds = [];
    if (currentUserId) {
      const likedDocs = await Like.find({ user: currentUserId }).select('post').lean();
      likedPostIds = likedDocs.map(doc => doc.post.toString());
    }

    // Add liked field to each post
    const postsWithLikeStatus = posts.map(post => ({
      ...post,
      liked: likedPostIds.includes(post._id.toString()),
    }));

    const total = await Post.countDocuments({ user: userId });

    return res.status(200).json({
      success: true,
      data: postsWithLikeStatus,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while fetching user posts',
    });
  }
}

export async function updatePost(req, res) {
  const { postId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  try {
    if (!content || content.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Post content cannot be empty',
      });
    }

    if (content.length > 280) {
      return res.status(400).json({
        success: false,
        message: 'Post content cannot exceed 280 characters',
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    if (post.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this post',
      });
    }

    post.content = content.trim();
    await post.save();
    await post.populate('user', 'username avatar isVerified');

    // Add liked field (false for updated post, or check if current user liked it)
    const likeExists = await Like.exists({ user: userId, post: postId });
    const postWithLikeStatus = {
      ...post.toObject(),
      liked: !!likeExists,
    };

    return res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: postWithLikeStatus,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while updating post',
    });
  }
}

export async function deletePost(req, res) {
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    if (post.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this post',
      });
    }

    await Post.findByIdAndDelete(postId);

    // Update user's posts count
    await User.findByIdAndUpdate(userId, { $inc: { postsCount: -1 } });

    return res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while deleting post',
    });
  }
}
