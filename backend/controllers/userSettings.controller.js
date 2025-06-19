import pool from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.js';

class UserSettingsController {
  static async getSettings(req, res) {
    const userId = req.user.userId;

    try {
      const userResult = await pool.query(
        `SELECT user_name, profile_image, wallet_address FROM users WHERE id = $1`,
        [userId]
      );

      if (userResult.rows.length === 0) {
        return sendError(res, 'User not found with the given ID.', 404);
      }

      const user = userResult.rows[0];

      const settingsResult = await pool.query(
        `SELECT new_airdrop_alerts, weekly_reports, task_reminders, mode, language
         FROM user_settings WHERE user_id = $1`,
        [userId]
      );

      const settings = settingsResult.rows[0] || {};

      const userData = {
        user_name: user.user_name,
        profile_image: user.profile_image,
        wallet_address: user.wallet_address,
        ...settings,
      };

      return sendSuccess(
        res,
        userData,
        'User data with settings fetched successfully',
        200
      );
    } catch (error) {
      return sendError(
        res,
        'An error occurred while retrieving user settings. Please try again later',
        500,
        error
      );
    }
  }

  static async updateAllSettings(req, res) {
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
      if (user_name || profile_image || wallet_address) {
        await pool.query(
          `UPDATE users SET
            user_name = $1,
            profile_image = $2,
            wallet_address = $3
           WHERE id = $4`,
          [user_name, profile_image, wallet_address, userId]
        );
      }

      await pool.query(
        `UPDATE user_settings SET
          new_airdrop_alerts = $1,
          weekly_reports = $2,
          task_reminders = $3,
          mode = $4,
          language =$5
         WHERE user_id = $6`,
        [
          new_airdrop_alerts,
          weekly_reports,
          task_reminders,
          mode,
          language,
          userId,
        ]
      );
      const userResult = await pool.query(
        `SELECT user_name, profile_image, wallet_address FROM users WHERE id = $1`,
        [userId]
      );

      if (userResult.rows.length === 0) {
        return sendError(res, 'User not found after update.', 404);
      }
      const settingsResult = await pool.query(
        `SELECT new_airdrop_alerts, weekly_reports, task_reminders, mode, language
         FROM user_settings WHERE user_id = $1`,
        [userId]
      );

      const user = userResult.rows[0];
      const settings = settingsResult.rows[0] || {};

      const userData = {
        user_name: user.user_name,
        profile_image: user.profile_image,
        wallet_address: user.wallet_address,
        ...settings,
      };
      return sendSuccess(
        res,
        userData,
        'User profile and settings updated successfully.',
        200
      );
    } catch (error) {
      return sendError(
        res,
        'An error occurred while updating settings. Please try again later.',
        500,
        error
      );
    }
  }
}

export default UserSettingsController;
