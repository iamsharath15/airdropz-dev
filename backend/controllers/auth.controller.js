import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import { sendVerificationEmail, sendWelcomeEmail } from '../utils/email.js';
import { generateVerificationToken } from '../utils/generateVerificationToken.js';

// @desc Register a new user
// @route POST /api/auth/signup
// @access Public
export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check for missing fields
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    // Check if user already exists
    const existing = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);
    if (existing.rows.length > 0)
      return res.status(409).json({ error: 'User already exists' });
    // Hash password

    const hashed = await bcrypt.hash(password, 10);
    // Generate email verification token

    const verificationToken = generateVerificationToken();
    const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    // Insert user into database

    const result = await pool.query(
      `INSERT INTO users (username, email, password, verification_token, verification_token_expires_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, username, email`,
      [username, email, hashed, verificationToken, tokenExpiresAt]
    );
    // Send email verification link

    await sendVerificationEmail(email, verificationToken);
    // Optionally set auth cookie

    generateTokenAndSetCookie(res, result.rows[0].id);
    // Respond with created user info

    res
      .status(201)
      .json({ message: 'User created', user: { ...result.rows[0] } });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Signup failed' });
  }
};

// @desc Log in a user
// @route POST /api/auth/login
// @access Public
// controllers/auth.controller.js
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);

    if (result.rows.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // 2. Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid credentials' });
    }

    // 3. Generate token and set cookie
    generateTokenAndSetCookie(res, user.id); // use user.id for PostgreSQL
    sendVerificationEmail(user.email, verificationToken);

    // 4. Update last_login timestamp
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [
      user.id,
    ]);

    // 5. Remove password before sending user data back
    delete user.password;

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      user,
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};

// @desc Log out the current user
// @route POST /api/auth/logout
// @access Private (Requires JWT)
export const logout = async (req, res) => {
  res.clearCookie('token'); // Removes the JWT from browser cookie
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE verification_token = $1 AND verification_token_expires_at > NOW()',
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code',
      });
    }

    const user = result.rows[0];

    // Update user
    await pool.query(
      `UPDATE users
       SET is_verified = true,
           verification_token = NULL,
           verification_token_expires_at = NULL
       WHERE id = $1`,
      [user.id]
    );

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.username);
    } catch (emailError) {
      console.error('Error sending welcome email', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        is_verified: true,
      },
    });
  } catch (error) {
    console.error('Error in verifyEmail:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const userId = req.userId;
    const result = await pool.query(
      'SELECT id, username, email, last_login, is_verified, created_at, updated_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.log('Error in checkAuth', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetPasswordExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour from now

    await pool.query(
      `UPDATE users 
       SET reset_password_token = $1, reset_password_expires_at = $2 
       WHERE email = $3`,
      [resetToken, resetPasswordExpiresAt, email]
    );

    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendPasswordResetEmail(email, resetURL);

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email',
    });
  } catch (error) {
    console.log('Error in forgotPassword', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const result = await pool.query(
      `SELECT * FROM users 
       WHERE reset_password_token = $1 AND reset_password_expires_at > NOW()`,
      [token]
    );

    const user = result.rows[0];

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid or expired reset token' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `UPDATE users 
       SET password = $1, reset_password_token = NULL, reset_password_expires_at = NULL 
       WHERE id = $2`,
      [hashedPassword, user.id]
    );

    await sendResetSuccessEmail(user.email);

    res
      .status(200)
      .json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    console.log('Error in resetPassword', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
