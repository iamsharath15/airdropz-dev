import express from 'express';
import UserTaskController from '../controllers/userTasks.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

// @route GET /api/user-tasks/:userId
// @desc Get all tasks assigned to a user (with subtasks)
// @access Private
router.get('/:userId', verifyToken, UserTaskController.getUserTasks);

export default router;
