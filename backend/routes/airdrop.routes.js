import express from 'express';
import AirdropController from '../controllers/airdrop.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();

/**
 * @route   GET /api/airdrop/v1/
 * @desc    Get all airdrops
 * @access  Public
 */
router.get('/', AirdropController.getAllAirdrops);

/**
 * @route   GET /api/airdrop/v1/:id
 * @desc    Get a single airdrop by ID
 * @access  Public
 */
router.get('/:id', AirdropController.getAirdropById);

// Apply auth & admin middleware for routes below
router.use(verifyToken, isAdmin);

/**
 * @route   POST /api/airdrop/v1/
 * @desc    Create a new airdrop
 * @access  Admin
 */
router.post('/', AirdropController.createAirdrop);

/**
 * @route   PUT /api/airdrop/:id
 * @desc    Update an existing airdrop by ID
 * @access  Admin
 */
router.put('/:id', AirdropController.updateAirdrop);

/**
 * @route   DELETE /api/airdrop/v1/:id
 * @desc    Delete an airdrop by ID
 * @access  Admin
 */
router.delete('/:id', AirdropController.deleteAirdrop);

/**
 * @route   PUT /api/airdrop/v1/content-blocks/:airdropId
 * @desc    Create content blocks for an airdrop
 * @access  Admin
 */
router.post(
  '/content-blocks/:airdropId',
  AirdropController.createContentBlocks
);

/**
 * @route   PATCH /api/airdrop/v1/content-blocks/:airdropId
 * @desc    Update content blocks for an airdrop
 * @access  Admin
 */
router.patch(
  '/content-blocks/:airdropId',
  AirdropController.updateContentBlocks
);

export default router;
