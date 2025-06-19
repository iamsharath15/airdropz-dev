import express from 'express';
import UserSettingsController from '../controllers/userSettings.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', UserSettingsController.getSettings);
router.patch('/', UserSettingsController.updateAllSettings);

export default router;
