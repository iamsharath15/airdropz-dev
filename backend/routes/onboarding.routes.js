import express from "express";
import OnboardingController from "../controllers/onboarding.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, OnboardingController.submitOnboarding);
router.get("/", verifyToken, OnboardingController.getOnboarding);

export default router;
