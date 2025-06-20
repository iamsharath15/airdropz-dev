import express from 'express';
import DailyLoginController from '../controllers/streak.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.post('/daily-login', verifyToken, DailyLoginController.handleDailyLogin);
router.get('/login-dates', verifyToken, DailyLoginController.getLoginDates);

export default router;
