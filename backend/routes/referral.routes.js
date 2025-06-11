// done v1
import express from "express";
import { getReferralStats } from "../controllers/referral.controller.js";
import { protect } from "../middlewares/authMiddleware.js"; 

const router = express.Router();

router.get("/stats", protect, getReferralStats);

export default router;
