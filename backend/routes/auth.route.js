import express from "express";
import { login, logout, signup, verifyEmail, forgotPassword, resetPassword } from "../controllers/auth.controller.js";

const router = express.Router();

router.post('/signup', signup); // Register User
router.post('/login', login); // Login User
router.post('/logout', logout); // Logout user
// router.get("/check-auth", verifyToken, checkAuth)
router.post("/verify-email", verifyEmail)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password/:token", resetPassword)

router.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

export default router