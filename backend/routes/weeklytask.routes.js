import express from "express";
import WeeklyTaskController from "../controllers/weeklyTask.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/", WeeklyTaskController.create);
router.get("/", WeeklyTaskController.getAll);
router.delete("/:id", WeeklyTaskController.delete);
router.post('/upload-subtask-image/:weekly_task_id', verifyToken, WeeklyTaskController.userTaskCheckList);
router.get('/upload-subtask-image/:weekly_task_id/status', verifyToken, WeeklyTaskController.getUserTaskStatus);
router.get('/:weekly_task_id/with-user-progress', verifyToken, WeeklyTaskController.getWeeklyTaskWithUserProgress);
router.get('/top-weekly-tasks', WeeklyTaskController.getTopWeeklyTask);
router.get("/:id", WeeklyTaskController.getById);
router.put("/:id", WeeklyTaskController.update);
export default router;
