import express from 'express';
import { getLeaderboard, addPoints } from '../controllers/leaderboard.controller.js';

const router = express.Router();

router.get('/', getLeaderboard);         // GET /api/leaderboard
router.post('/add', addPoints);          // POST /api/leaderboard/add

export default router;
