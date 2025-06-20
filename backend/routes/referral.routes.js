// done v1

import express from "express";
import ReferralController from "../controllers/referral.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/stats", verifyToken, ReferralController.getReferralStats);

export default router;
