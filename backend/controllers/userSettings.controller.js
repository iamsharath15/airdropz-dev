import pool from '../config/db.js';

class UserSettingsController {
  // GET /api/settings
  static async getSettings(req, res) {
    const userId = req.user.userId;

    try {
      const userResult = await pool.query(
        `SELECT user_name, profile_image, wallet_address FROM users WHERE id = $1`,
        [userId]
      );
 if (userResult.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = userResult.rows[0];
      const settingsResult = await pool.query(
        `SELECT new_airdrop_alerts, weekly_reports, task_reminders, mode, language
         FROM user_settings WHERE user_id = $1`,
        [userId]
      );

     console.log(settingsResult.rows[0]);
     
      const settings = settingsResult.rows[0] || {};

      return res.status(200).json({
        user_name: user.user_name,
        profile_image: user.profile_image,
        wallet_address: user.wallet_address, // from `users` table
        ...settings, // includes notification/display settings
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      res.status(500).json({ message: 'Failed to fetch settings' });
    }
  }

  // PATCH /api/settings
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
      // Update users table (if provided)
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

      // Update user_settings table (if provided)
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
      console.log(userResult);
            console.log(userId);

if (userResult.rows.length === 0) {
  return res.status(404).json({ message: 'User not found after update' });
}
      const settingsResult = await pool.query(
        `SELECT new_airdrop_alerts, weekly_reports, task_reminders, mode, language
       FROM user_settings WHERE user_id = $1`,
        [userId]
      );

      const user = userResult.rows[0];
      const settings = settingsResult.rows[0] || {};

      res.status(200).json({
        message: 'All settings updated',
        user_name: user.user_name,
        profile_image: user.profile_image,
        wallet_address: user.wallet_address,
        ...settings,
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      res.status(500).json({ message: 'Failed to update settings' });
    }
  }
}

export default UserSettingsController;
