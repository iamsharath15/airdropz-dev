import express from "express";
import WeeklyTaskController from "../controllers/weeklyTask.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/", WeeklyTaskController.create);
router.get("/", WeeklyTaskController.getAll);
router.get("/:id", WeeklyTaskController.getById);
router.put("/:id", WeeklyTaskController.update);
router.delete("/:id", WeeklyTaskController.delete);
router.post('/upload-subtask-image/:weekly_task_id', verifyToken, WeeklyTaskController.userTaskCheckList);
router.get('/upload-subtask-image/:weekly_task_id/status', verifyToken, WeeklyTaskController.getUserTaskStatus);
router.get('/:id/with-user-progress', verifyToken, WeeklyTaskController.getWeeklyTaskWithUserProgress);

export default router;
