import { Router } from 'express';
import { verifyToken } from '../middlewares/verifyToken.middleware.js';
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  checkFollowStatus,
} from '../controllers/follow.controller.js';

const router = Router();

router.post('/:userId', verifyToken, followUser);
router.delete('/:userId', verifyToken, unfollowUser);
router.get('/:userId/followers', verifyToken, getFollowers);
router.get('/:userId/following', verifyToken, getFollowing);
router.get('/:userId/status', verifyToken, checkFollowStatus);

export default router;
