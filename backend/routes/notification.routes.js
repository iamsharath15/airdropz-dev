import express from 'express';
import { NotificationController } from '../controllers/notification.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { requireUserId } from '../middlewares/requireUserId.js';

const router = express.Router();
const controller = new NotificationController();

router.use(verifyToken, requireUserId);
router.get('/notifications', controller.getUserNotifications);
router.post('/notifications', controller.createNotification);
router.put('/read/:id', controller.markAsRead);

export default router;
