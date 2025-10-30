import { Router } from 'express';
import {
  createPost,
  getPost,
  getAllPosts,
  getUserPosts,
  updatePost,
  deletePost,
  replyToPost,       
  getPostReplies,    
} from '../controllers/post.controller.js';
import { upload } from '../config/cloudinary.js';
import { handleUploadError } from '../middlewares/upload.middleware.js';
import { verifyToken } from '../middlewares/verifyToken.middleware.js';

const router = Router();

// Get routes
router.get('/', verifyToken, getAllPosts);
router.get('/user/:userId', verifyToken, getUserPosts);
router.get('/:postId', verifyToken, getPost);
router.get('/:postId/replies', verifyToken, getPostReplies); 

// Create routes
router.post(
  '/',
  verifyToken,
  upload.single('media'),
  handleUploadError,
  createPost
);

router.post(
  '/:postId/reply',                    
  verifyToken,
  upload.single('media'),
  handleUploadError,
  replyToPost
);

// Update/Delete routes
router.put('/:postId', verifyToken, updatePost);
router.delete('/:postId', verifyToken, deletePost);

export default router;
