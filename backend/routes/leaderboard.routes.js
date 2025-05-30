import express from 'express';
import LeaderboardController from '../controllers/leaderboard.controller.js';

const router = express.Router();

router.get('/', LeaderboardController.getLeaderboard);

export default router;
