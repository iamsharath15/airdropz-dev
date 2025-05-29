import express from "express";
import UserController from "../controllers/auth.controller.js";
import { authenticateUser } from "../utils/generateTokenAndSetCookie.js";
import { verifyToken } from "../middlewares/verifyToken.js";


const router = express.Router();

// @route POST /api/auth/v1/signup
// @desc Register a new user
// @access Public
router.post('/signup', UserController.registerUser);

// @route POST /api/auth/v1/verify-email
// @desc Verify user email using OTP and mark account as verified
// @access Public
router.post("/verify-email", UserController.verifyUserEmail);

// @route POST /api/auth/v1/logout
// @desc Log out the currently authenticated user
// @access Private (Requires JWT)
router.post('/logout', UserController.logoutUser);

// @route POST /api/auth/v1/login
// @desc Log in user with email and password
// @access Public
router.post('/login', UserController.loginUser);

// @route POST /api/auth/v1/request-password-reset
// @desc Request password reset by sending reset token to user's email
// @access Public
router.post("/request-password-reset", UserController.requestPasswordReset)

// @route POST /api/auth/v1/reset-password/:token
// @desc Reset user password using a valid reset token
// @access Public
router.post("/reset-password/:token", UserController.resetUserPassword)
router.get("/check-auth", verifyToken, UserController.checkAuth);

// router.get("/check-auth", verifyToken, checkAuth)

// router.get('/users', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM users');
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Database error');
//   }
// });
router.get("/profile", authenticateUser, (req, res) => {
  res.json({ success: true, userId: req.user.userId });
});
export default router