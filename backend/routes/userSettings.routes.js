import express from 'express';
import UserSettingsController from '../controllers/userSettings.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', UserSettingsController.getSettings);
router.put('/account', UserSettingsController.updateAccount);
router.put('/notifications', UserSettingsController.updateNotifications);
router.put('/display', UserSettingsController.updateDisplay);
router.put('/wallet', UserSettingsController.updateWallet);

export default router;
