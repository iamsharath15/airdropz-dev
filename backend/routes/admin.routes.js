import express from 'express';
import AdminController from '../controllers/admin.controller.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();
const adminAuth = [verifyToken, isAdmin];

router.get('/stats', adminAuth, AdminController.getDashboardStats);
router.get('/users', adminAuth, AdminController.getAllUsers);

export default router;
