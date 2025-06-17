import express from 'express';
import UserTasksController from '../controllers/userTasks.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.post('/add/:weeklyTaskId', verifyToken, UserTasksController.addTask);
router.delete('/remove/:weeklyTaskId', verifyToken, UserTasksController.removeTask);
// router.get('/user', authenticate, UserTasksController.getUserTasks);
router.get('/all',verifyToken, UserTasksController.getAllUserTasks);
// router.get('/top', UserTasksController.getTopAddedTasks);

export default router;
