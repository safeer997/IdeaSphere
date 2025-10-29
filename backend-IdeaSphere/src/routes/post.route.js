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

// -------------------- Routes with Authentication --------------------
// Add verifyToken to ALL routes so req.user is available
// This allows us to check which posts the current user has liked

router.get('/', verifyToken, getAllPosts);
router.get('/user/:userId', verifyToken, getUserPosts);
router.get('/:postId', verifyToken, getPost);

// -------------------- Protected Routes (Create, Update, Delete) --------------------
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
