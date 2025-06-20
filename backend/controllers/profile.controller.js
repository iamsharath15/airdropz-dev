import pool from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.js';

class ProfileController {
  static async getProfile(req, res) {
    const userId = req.user.userId;

    try {
      const result = await pool.query(
        `SELECT 
        u.user_name,
        u.email,
        p.profile_image,
        p.referral_code,
        p.daily_login_streak_count,
        p.airdrops_earned,
        p.airdrops_remaining,
        p.heard_from,
        p.interests,
        p.experience_level,
        p.wallet_address,
        p.new_airdrop_alerts,
        p.weekly_reports,
        p.task_reminders,
        p.mode,
        p.language
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.id = $1`,
        [userId]
      );

      if (result.rows.length === 0) {
        // Create default profile if not exists
        await pool.query(
          `INSERT INTO profiles (user_id) VALUES ($1) ON CONFLICT DO NOTHING`,
          [userId]
        );

        const defaultProfile = await pool.query(
          `SELECT 
          u.user_name,
          u.email,
          p.profile_image,
          p.referral_code,
          p.daily_login_streak_count,
          p.airdrops_earned,
          p.airdrops_remaining,
          p.heard_from,
          p.interests,
          p.experience_level,
          p.wallet_address,
          p.new_airdrop_alerts,
          p.weekly_reports,
          p.task_reminders,
          p.mode,
          p.language
        FROM users u
        LEFT JOIN profiles p ON u.id = p.user_id
        WHERE u.id = $1`,
          [userId]
        );

        return sendSuccess(
          res,
          defaultProfile.rows[0],
          'Default profile created',
          200
        );
      }

      return sendSuccess(
        res,
        result.rows[0],
        'Profile fetched successfully',
        200
      );
    } catch (error) {
      return sendError(
        res,
        'An error occurred while fetching profile data.',
        500,
        error
      );
    }
  }

  static async updateProfile(req, res) {
    const userId = req.user.userId;
    const {
      user_name,
      profile_image,
      wallet_address,
      new_airdrop_alerts,
      weekly_reports,
      task_reminders,
      mode,
      language,
    } = req.body;

    try {
      if (user_name) {
        await pool.query(
          `UPDATE users SET 
          user_name = $1
        WHERE id = $2`,
          [user_name, userId]
        );
      }

      await pool.query(
        `UPDATE profiles SET
          profile_image = $1,
          wallet_address = $2,
          new_airdrop_alerts = $3,
          weekly_reports = $4,
          task_reminders = $5,
          mode = $6,
          language = $7
         WHERE user_id = $8`,
        [
          profile_image,
          wallet_address,
          new_airdrop_alerts,
          weekly_reports,
          task_reminders,
          mode,
          language,
          userId,
        ]
      );

      // Fetch updated profile
      const updated = await pool.query(
        `SELECT 
        u.user_name,
        p.profile_image,
        p.wallet_address,
        p.new_airdrop_alerts,
        p.weekly_reports,
        p.task_reminders,
        p.mode,
        p.language
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.id = $1`,
        [userId]
      );

      return sendSuccess(
        res,
        updated.rows[0],
        'Profile updated successfully.',
        200
      );
    } catch (error) {
      return sendError(
        res,
        'An error occurred while updating profile.',
        500,
        error
      );
    }
  }
}

export default ProfileController;
