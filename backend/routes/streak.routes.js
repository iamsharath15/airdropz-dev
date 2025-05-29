import express from 'express';
import { handleDailyLogin } from '../controllers/dailyLogin.controller.js';
import{ authenticateUser} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/daily-login', authenticateUser, handleDailyLogin);

export default router;
