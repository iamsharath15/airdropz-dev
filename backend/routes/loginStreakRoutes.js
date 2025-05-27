import express from "express";
import { updateLoginStreak } from "../controllers/loginStreakController.js";
import { verifyToken } from "../middleware/authMiddleware.js"; // assuming you have JWT auth

const router = express.Router();

router.post("/streak", verifyToken, updateLoginStreak);

export default router;
