import express from 'express';
import DailyLoginController from '../controllers/streak.controller.js';
import{ protect} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/daily-login', protect, DailyLoginController.handleDailyLogin);
router.get('/login-dates', protect, DailyLoginController.getLoginDates);

export default router;
