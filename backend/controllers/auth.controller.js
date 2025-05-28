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
      const referrerResult = await pool.query(
        'SELECT id FROM users WHERE referral_code = $1',
        [referralCode]
      );
      if (referrerResult.rows.length === 0) {
        return res.status(400).json({
          error: 'Invalid Referral Code',
          message:
            'Referral code is invalid. Please enter a valid referral code or continue without one.',
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
      await pool.query(`UPDATE users SET points = points + 50 WHERE id = $1`, [
        referrerId,
      ]);
      await pool.query(`UPDATE users SET points = points + 25 WHERE id = $1`, [
        newUser.id,
      ]);
      await pool.query(
        `INSERT INTO referrals (referrer_id, referred_id) VALUES ($1, $2)`,
        [referrerId, newUser.id]
      );
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

export const verifyUserEmail = async (req, res) => {
  const { code } = req.body;

  try {
    const result = await pool.query(
      `SELECT * FROM users
       WHERE verification_token = $1
       AND verification_token_expires_at > NOW()
       `,
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code.',
      });
    }

    const user = result.rows[0];

    // Mark user as verified and remove verification token
    await pool.query(
      `
      UPDATE users
      SET
       is_verified = true,
       verification_token = NULL,
       verification_token_expires_at = NULL
      WHERE id = $1
      `,
      [user.id]
    );

    // Try sending welcome email
    try {
      await sendWelcomeEmail(user.email, user.username);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
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
    console.error('Error in verifyUserEmail:', error);
    return res.status(500).json({
      success: false,
      message: 'nternal server error. Please try again.',
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find user by email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const user = result.rows[0];

    // 2. Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // 3. Check if email is verified (optional)
    if (!user.is_verified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email before logging in.',
      });
    }

    // 4. Generate auth token and set cookie
    generateTokenAndSetCookie(res, user.id);

    // 5. Update last login timestamp
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [
      user.id,
    ]);

    // 6. Remove password before sending user info
    delete user.password;

    // 7. Send success response
    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      user,
    });
  } catch (error) {
    console.error('Error in loginUser:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return res.status(200).json({
      success: true,
      message: 'User logged out successfully',
    });
  } catch (error) {
    console.error('Error in logoutUser:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to log out user.',
    });
  }
};

export const resetUserPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  console.log('Received token:', token);

  try {
    // 1. Verify the reset token and expiration
    const result = await pool.query(
      `SELECT * FROM users 
       WHERE reset_password_token = $1
      AND reset_password_expires_at > NOW()`,
      [token]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    // 2. Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Update user's password and clear reset token fields
    await pool.query(
      `UPDATE users 
       SET password = $1, reset_password_token = NULL, reset_password_expires_at = NULL 
       WHERE id = $2`,
      [hashedPassword, user.id]
    );

    // 4. Notify the user via email
    await sendResetSuccessEmail(user.email);

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully',
    });
  } catch (error) {
    console.log('Error in resetUserPassword:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
};

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    // 1. Check if the user exists
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }

    // 2. Generate reset token and expiration (1 hour)
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetPasswordExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour from now

    // 3. Store token and expiry in database
    await pool.query(
      `UPDATE users 
       SET reset_password_token = $1, reset_password_expires_at = $2 
       WHERE email = $3`,
      [resetToken, resetPasswordExpiresAt, email]
    );

    // 4. Construct reset URL and send email
    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendPasswordResetEmail(email, resetURL);

    // 5. Respond with success
    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email',
    });
  } catch (error) {
    console.log('Error in forgotPassword', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
};

// @desc Get the currently authenticated user's profile
// @route GET /api/auth/v1/me
// @access Private (Requires JWT)
// export const getAuthenticatedUser = async (req, res) => {
//   try {
//     const userId = req.userId;

//     const result = await pool.query(
//       `SELECT id, username, email, last_login, is_verified, created_at, updated_at
//        FROM users
//        WHERE id = $1`,
//       [userId]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found',
//       });
//     }

//     res.status(200).json({
//       success: true,
//       user: result.rows[0],
//     });
//   } catch (error) {
//     console.log('Error in getAuthenticatedUser:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error. Please try again later.',
//     });
//   }
// };
