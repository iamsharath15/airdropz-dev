import express from 'express';
import AirdropController from '../controllers/airdrop.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();

router.get('/', AirdropController.getAllAirdrops);
router.get('/:id', AirdropController.getAirdropById);

router.use(verifyToken, isAdmin); // Apply to all below routes
router.post('/', AirdropController.createAirdrop);
router.put('/:id', AirdropController.updateAirdrop);
router.delete('/:id', AirdropController.deleteAirdrop);
router.put('/content-blocks/:airdropId', AirdropController.createContentBlocks);
router.patch('/content-blocks/:airdropId', AirdropController.updateContentBlocks);

export default router;
