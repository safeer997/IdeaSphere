import { Router } from 'express';
import { verifyToken } from '../middlewares/verifyToken.middleware.js';
import {
  likePost,
  unlikePost,
  getUserLikes,
} from '../controllers/like.controller.js';

const router = Router();


router.post('/:postId', verifyToken, likePost);
router.delete('/:postId', verifyToken, unlikePost);
router.get('/user/:userId', verifyToken, getUserLikes);

export default router;
