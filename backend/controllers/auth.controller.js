import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
// import {
//   sendPasswordResetEmail,
//   sendResetSuccessEmail,
//   sendVerificationEmail,
//   sendWelcomeEmail,
// } from '../utils/email.js';
import { generateVerificationToken } from '../utils/generateVerificationToken.js';
import { generateReferralCode } from '../utils/generateReferralCode.js';

class UserController {
  static async registerUser(req, res) {
    const { username, email, password, referralCode } = req.body;

    try {
      if (!username || !email || !password) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Username, email, and password are required.',
        });
      }

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

      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationToken = generateVerificationToken();
      const verificationTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
      const generatedReferralCode = generateReferralCode(username);

      const defaultUserRole = 'user';

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
        await pool.query(
      `INSERT INTO leaderboard (user_id, points)
       VALUES ($1, 0)
       ON CONFLICT (user_id) DO NOTHING`,
      [newUser.id]
    );
      if (referrerId) {
        await pool.query(
        `UPDATE leaderboard SET points = points + 50 WHERE user_id = $1`,
          [referrerId]
        );
        await pool.query(
        `UPDATE leaderboard SET points = points + 25 WHERE user_id = $1`,
          [newUser.id]
        );
        await pool.query(
          `INSERT INTO referrals (referrer_id, referred_id, referral_code_used) VALUES ($1, $2, $3)`,
          [referrerId, newUser.id, referralCode]
        );
      }

      // await sendVerificationEmail(email, verificationToken);

      generateTokenAndSetCookie(res, newUser.id);

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
  }

  static async verifyUserEmail(req, res) {
    const { code } = req.body;

    try {
      const result = await pool.query(
        `SELECT * FROM users
         WHERE verification_token = $1
         AND verification_token_expires_at > NOW()`,
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
      try {
        // await sendWelcomeEmail(user.email, user.username);
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
  }

  static async loginUser(req, res) {
    const { email, password } = req.body;

    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [
        email,
      ]);
      const user = result.rows[0];

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email or password.',
        });
      }

      if (!user.is_verified) {
        return res.status(401).json({
          success: false,
          message: 'Email not verified.',
        });
      }

      generateTokenAndSetCookie(res, user.id);
      await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [
        user.id,
      ]);

      delete user.password;

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
  }

  static async logoutUser(req, res) {
    try {
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
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout failed.',
      });
    }
  }

  static async requestPasswordReset(req, res) {
    const { email } = req.body;

    try {
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

      const resetToken = crypto.randomBytes(20).toString('hex');
      const resetPasswordExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour from now

      await pool.query(
        `UPDATE users SET reset_password_token = $1, reset_password_expires_at = $2 WHERE email = $3`,
        [resetToken, resetPasswordExpiresAt, email]
      );

      const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
      // await sendPasswordResetEmail(email, resetURL);

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
  }

  static async resetUserPassword(req, res) {
    const { token } = req.params;
    const { password } = req.body;

    try {
      const result = await pool.query(
        `SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expires_at > NOW()`,
        [token]
      );

      const user = result.rows[0];
      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: 'Invalid or expired token.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query(
        `UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expires_at = NULL WHERE id = $2`,
        [hashedPassword, user.id]
      );

      // await sendResetSuccessEmail(user.email);
      res
        .status(200)
        .json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ success: false, message: 'Server error.' });
    }
  }

  static async checkAuth(req, res) {
    try {
      const result = await pool.query(
        `SELECT id, username, email, role FROM users WHERE id = $1`,
        [req.userId]
      );

      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: 'User not found' });
      }

      return res.status(200).json({ success: true, user: result.rows[0] });
    } catch (error) {
      console.error('checkAuth error:', error);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }
}

export default UserController;

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
