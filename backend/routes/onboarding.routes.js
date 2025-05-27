import express from "express";
import { submitOnboarding } from "../controllers/onboardingController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateUser, submitOnboarding);

export default router;
