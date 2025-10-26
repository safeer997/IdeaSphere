import { Router } from 'express';
import {
  createPost,
  getPost,
  getAllPosts,
  getUserPosts,
  updatePost,
  deletePost,
} from '../controllers/post.controller.js';
import { upload } from '../config/cloudinary.js';
import { handleUploadError } from '../middlewares/upload.middleware.js';
import { verifyToken } from '../middlewares/verifyToken.middleware.js';

const router = Router();

// -------------------- Public Routes --------------------

router.get('/', getAllPosts);
router.get('/:postId', getPost);
router.get('/user/:userId', getUserPosts);

// -------------------- Protected Routes --------------------
router.post(
  '/',
  verifyToken,
  upload.single('media'),
  handleUploadError,
  createPost
);

router.put('/:postId', verifyToken, updatePost);
router.delete('/:postId', verifyToken, deletePost);

export default router;
