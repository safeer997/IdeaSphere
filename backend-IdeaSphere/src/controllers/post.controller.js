import { Post } from '../models/post.model.js';
import { User } from '../models/user.model.js';

export async function createPost(req, res) {
  const { content } = req.body;
  const userId = req.user._id;

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
    await createdPost.populate('user', 'username avatar');

    // Update user's posts count
    await User.findByIdAndUpdate(userId, { $inc: { postsCount: 1 } });

    return res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: createdPost,
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

  try {
    const post = await Post.findById(postId)
      .populate('user', 'username avatar bio')
      .populate({
        path: 'parentPost',
        populate: { path: 'user', select: 'username avatar' },
      });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: post,
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

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'username avatar')
      .lean();

    const total = await Post.countDocuments();

    return res.status(200).json({
      success: true,
      data: posts,
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
      .populate('user', 'username avatar')
      .lean();

    const total = await Post.countDocuments({ user: userId });

    return res.status(200).json({
      success: true,
      data: posts,
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
  const userId = req.user._id;

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
    await post.populate('user', 'username avatar');

    return res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: post,
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
  const userId = req.user._id;

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
