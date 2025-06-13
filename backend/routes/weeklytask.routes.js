import express from "express";
import WeeklyTaskController from "../controllers/weeklyTask.controller.js";

const router = express.Router();

router.post("/", WeeklyTaskController.create);
router.get("/", WeeklyTaskController.getAll);
router.get("/:id", WeeklyTaskController.getById);
router.put("/:id", WeeklyTaskController.update);
router.delete("/:id", WeeklyTaskController.delete);

export default router;
