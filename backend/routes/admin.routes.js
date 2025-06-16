import express from 'express';
import AdminController from '../controllers/AdminController.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

// GET /api/admin/stats
router.get('/stats',verifyToken, isAdmin, AdminController.getDashboardStats);

export default router;
