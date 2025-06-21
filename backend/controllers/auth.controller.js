// done v1
import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
// import {
//   sendPasswordResetEmail,
//   sendResetSuccessEmail,
//   sendVerificationEmail,
//   sendWelcomeEmail,
// } from '../utils/emailService/email.js';
 import {   sendPasswordResetEmail,
} from '../utils/emailService/email.js';
import { generateVerificationToken } from '../utils/generateVerificationToken.js';
import { generateReferralCode } from '../utils/generateReferralCode.js';
import { createUserNotification } from '../services/notificationService.js';
import { sendSuccess, sendError } from '../utils/response.js';

class UserController {
  static async registerUser(req, res) {
    const { user_name, email, password, referral_code } = req.body;

    try {
      // Validation
      if (!user_name || !email || !password) {
        return sendError(
          res,
          'Username, email, and password are required.',
          400,
          new Error('ValidationError: Missing required fields')
        );
      }

      // Check if user already exists
      const existingUser = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      if (existingUser.rows.length > 0) {
        return sendError(
          res,
          'A user with this email already exists.',
          409,
          new Error('Conflict Error : Duplicate email')
        );
      }

      // Handle referral code
      let referrerId = null;
      if (referral_code) {
        const referrerResult = await pool.query(
          'SELECT user_id FROM profiles WHERE referral_code = $1',
          [referral_code]
        );

        if (referrerResult.rows.length === 0) {
          return sendError(
            res,
            'Referral code is invalid. Please enter a valid referral code or continue without code.',
            400,
            new Error('Invalid Referral Code Error')
          );
        }
        referrerId = referrerResult.rows[0].user_id;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationToken = generateVerificationToken();
      const verificationTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min
      const defaultUserRole = 'user';

      // Insert user
      const insertUser = await pool.query(
        `INSERT INTO users (user_name, email, password, verification_token, verification_token_expires_at, role)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, user_name, email, role`,
        [
          user_name,
          email,
          hashedPassword,
          verificationToken,
          verificationTokenExpiry,
          defaultUserRole,
        ]
      );

      const newUser = insertUser.rows[0];
      const generatedReferralCode = generateReferralCode(user_name);

      // Create profile with referral code
      await pool.query(
        `INSERT INTO profiles (user_id, referral_code)
         VALUES ($1, $2)
         ON CONFLICT (user_id) DO NOTHING`,
        [newUser.id, generatedReferralCode]
      );

      // Welcome notification
      await createUserNotification({
        user_id: newUser.id,
        type: 'welcome',
        title: 'Welcome to LootCrate!',
        message: `Hi ${user_name}, welcome aboard! Start exploring airdrops and earning rewards.`,
        target_url: '',
        points_earned: 0,
      });

      // Leaderboard entry
      await pool.query(
        `INSERT INTO leaderboard (user_id, points)
         VALUES ($1, 0)
         ON CONFLICT (user_id) DO NOTHING`,
        [newUser.id]
      );

      // Handle referral rewards
      if (referrerId) {
        await pool.query(
          `UPDATE leaderboard SET points = points + 50 WHERE user_id = $1`,
          [referrerId]
        );
        await pool.query(
          `UPDATE profiles SET airdrops_earned = airdrops_earned + 50 WHERE user_id = $1`,
          [referrerId]
        );
        await pool.query(
          `UPDATE leaderboard SET points = points + 25 WHERE user_id = $1`,
          [newUser.id]
        );
        await pool.query(
          `UPDATE profiles SET airdrops_earned = airdrops_earned + 25 WHERE user_id = $1`,
          [newUser.id]
        );
        await pool.query(
          `INSERT INTO referrals (referrer_id, referred_id, referral_code_used) VALUES ($1, $2, $3)`,
          [referrerId, newUser.id, referral_code]
        );

        await createUserNotification({
          user_id: referrerId,
          type: 'referral',
          title: 'Referral Joined',
          message: `${user_name} joined using your referral code. You earned 50 points!`,
          target_url: '/referrals',
          points_earned: 50,
        });

        await createUserNotification({
          user_id: newUser.id,
          type: 'referral',
          title: 'Referral Bonus',
          message: `You signed up using a referral code. You earned 25 points!`,
          target_url: '/rewards',
          points_earned: 25,
        });
      }

      // send verification email
      // await sendVerificationEmail(email, verificationToken);

      // Set token
      generateTokenAndSetCookie(res, newUser.id);

      return sendSuccess(res, newUser, 'User created successfully.', 201);
    } catch (error) {
      return sendError(
        res,
        'An error occurred during signup. Please try again later.',
        500,
        error
      );
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
        return sendError(res, 'Invalid or expired verification code.', 400);
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
      } catch (error) {
        return sendError(res, 'Failed to send welcome email', 500, error);
      }
      const verifyUser = {
        email: user.email,
        user_name: user.user_name,
        is_verified: true,
      };
      return sendSuccess(res, verifyUser, 'Email verified successfully', 201);
    } catch (error) {
      return sendError(res, 'Error in verify user email', 500, error);
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
        return sendError(res, 'Invalid email or password.', 400);
      }

      if (!user.is_verified) {
        return sendError(res, 'Email not verified.', 401);
      }

      generateTokenAndSetCookie(res, user);
      await pool.query('UPDATE profiles SET last_login = NOW() WHERE user_id = $1', [
        user.id,
      ]);

      delete user.password;
      const safeUser = {
        id: user.id,
        email: user.email,
        user_name: user.user_name,
        role: user.role,
        is_new_user: user.is_new_user,
        is_verified: user.is_verified,
      };
      return sendSuccess(res, safeUser, 'successfully', 200);
    } catch (error) {
      return sendError(
        res,
        'Server error. Please try again later.',
        401,
        error
      );
    }
  }

  static async logoutUser(req, res) {
    try {
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      return sendSuccess(res, null, 'User logged out successfully.', 200);
    } catch (error) {
      return sendError(res, 'Logout failed.', 500, error);
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
        return sendError(res, 'User not found', 400);
      }

      const resetToken = crypto.randomBytes(20).toString('hex');
      const resetPasswordExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour from now

      await pool.query(
        `UPDATE users SET reset_password_token = $1, reset_password_expires_at = $2 WHERE email = $3`,
        [resetToken, resetPasswordExpiresAt, email]
      );

      const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
      //await sendPasswordResetEmail(email, resetURL);

      return sendSuccess(
        res,
        { email },
        'Password reset link sent to your email',
        200
      );
    } catch (error) {
      return sendError(
        res,
        'Server error. Please try again later.',
        500,
        error
      );
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
        return sendError(res, 'Invalid or expired token.', 400);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query(
        `UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expires_at = NULL WHERE id = $2`,
        [hashedPassword, user.id]
      );

      // await sendResetSuccessEmail(user.email);
      return sendSuccess(res, null, 'Password reset successfully', 200);
    } catch (error) {
      return sendError(res, 'Server error.', 500, error);
    }
  }

  static async resendOtp(req, res) {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    const user = userResult.rows[0];

    if (!user || user.is_verified) {
      return res
        .status(400)
        .json({ message: 'Invalid request or already verified.' });
    }

    const newToken = generateVerificationToken();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await pool.query(
      `UPDATE users SET verification_token = $1, verification_token_expires_at = $2 WHERE email = $3`,
      [newToken, expiresAt, email]
    );

    // await sendVerificationEmail(email, newToken);
    return res.json({ message: 'OTP resent to your email.' });
  }

  static async checkAuth(req, res) {
    try {
      const result = await pool.query(
        `SELECT id, user_name, email, role FROM users WHERE id = $1`,
        [req.user.userId]
      );

      if (result.rows.length === 0) {
        return sendError(res, 'User not found', 404);
      }
      const user = result.rows[0];

      const userDetails = {
        id: user.id,
        user_name: user.user_name,
        email: user.email,
        role: user.role,
      };

      return sendSuccess(
        res,
        userDetails,
        'User authenticated successfully.',
        200
      );
    } catch (error) {
      return sendError(res, 'Server error', 500, error);
    }
  }
}

export default UserController;
