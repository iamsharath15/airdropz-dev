import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from '../utils/email.js';
import { generateVerificationToken } from '../utils/generateVerificationToken.js';
import { generateReferralCode } from '../utils/generateReferralCode.js';

// @desc Register a new user
// @route POST /api/auth/signup
// @access Public
export const registerUser = async (req, res) => {
  const { username, email, password, referralCode } = req.body;

  try {
    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Username, email, and password are required.',
      });
    }

    // Check if user with this email already exists
    const existingUserResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    if (existingUserResult.rows.length > 0) {
      return res.status(409).json({
        error: 'Conflict Error',
        message: 'A user with this email already exists.',
      });
    }

    // Check referral code validity if provided
    let referrerId = null;
    if (referralCode) {
      const referrerResult = await pool.query('SELECT id FROM users WHERE referral_code = $1', [referralCode]);
      if (referrerResult.rows.length === 0) {
        return res.status(400).json({
          error: 'Invalid Referral Code',
          message: 'Referral code is invalid. Please enter a valid referral code or continue without one.',
          referralCodeInvalid: true,
        });
      }
      referrerId = referrerResult.rows[0].id;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token and expiry time (15 min)
    const verificationToken = generateVerificationToken();
const verificationTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); 

    // Generate referral code for the new user
    const generatedReferralCode = generateReferralCode(username);

    // Default role for new user
    const defaultUserRole = 'user';

    // Insert new user into DB
    const insertUserResult = await pool.query(
      `INSERT INTO users (username, email, password, referral_code, verification_token, verification_token_expires_at, role)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, username, email, referral_code, role`,
      [
        username,
        email,
        hashedPassword,
        generatedReferralCode,
        verificationToken,
        verificationTokenExpiry,
        defaultUserRole,
      ]
    );

    const newUser = insertUserResult.rows[0];

    // If valid referral code provided, handle referral rewards
    if (referrerId) {
      await pool.query(`UPDATE users SET points = points + 50 WHERE id = $1`, [referrerId]);
      await pool.query(`UPDATE users SET points = points + 25 WHERE id = $1`, [newUser.id]);
      await pool.query(`INSERT INTO referrals (referrer_id, referred_id) VALUES ($1, $2)`, [referrerId, newUser.id]);
    }

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    // Generate JWT token and set it in cookie
    generateTokenAndSetCookie(res, newUser.id);

    // Respond with success and new user data
    res.status(201).json({
      message: 'User successfully created.',
      user: newUser,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred during signup. Please try again later.',
    });
  }
};


// export const registerUser = async (req, res) => { /* your signup code */ };

// export const loginUser = async (req, res) => { /* your login code */ };

// export const logoutUser = async (req, res) => { /* your logout code */ };

// export const verifyUserEmail = async (req, res) => { /* your email verification code */ };

// export const getAuthenticatedUser = async (req, res) => { /* your check auth code */ };

// export const requestPasswordReset = async (req, res) => { /* your forgot password code */ };

// export const resetUserPassword = async (req, res) => { /* your reset password code */ };

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

    // 4. Update last_login timestamp
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [
      user.id,
    ]);

    // 6. Remove password before sending user data back
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
