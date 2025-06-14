import express from 'express';
import UserSettingsController from '../controllers/userSettings.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

// Protect all routes with token verification
router.use(verifyToken);

// GET current user settings
router.get('/', UserSettingsController.getSettings);

// PATCH all settings in a single API call
router.patch('/', UserSettingsController.updateAllSettings);

export default router;
