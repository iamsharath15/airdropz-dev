import express from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";

const router = express.Router();

router.post('/signup', signup); // Register User
router.post('/login', login); // Login User
router.post('/logout', logout); // Logout user

export default router