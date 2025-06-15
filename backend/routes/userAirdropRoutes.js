import express from 'express';
import UserAirdropController from '../controllers/userAirdrop.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.post('/:airdropId/like', verifyToken, UserAirdropController.likeAirdrop);
router.delete('/:airdropId/unlike', verifyToken, UserAirdropController.unlikeAirdrop);
router.get('/liked', verifyToken, UserAirdropController.getLikedAirdrops);
router.get('/:airdropId/liked', verifyToken, UserAirdropController.getIsAirdropLikedByUser);

export default router;
