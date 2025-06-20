import express from 'express';
import ProfileController from '../controllers/profile.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.use(verifyToken);

/**
 * @route   GET /api/account-settings/v1/profile
 * @desc    Get the current user's profile and settings
 * @access  Private
 */
router.get('/profile', ProfileController.getProfile);

/**
 * @route   PATCH /api/account-settings/v1/profile
 * @desc    Update current user's profile and settings
 * @access  Private
 */
router.patch('/profile', ProfileController.updateProfile);
/**
 * @route   POST /api/account-settings/v1/onboarding
 * @desc    Complete onboarding for the current user (update profile + user)
 * @access  Private
 */
router.post('/onboarding', ProfileController.onboarding);

export default router;
