import pool from '../config/db.js'; // ✅ Import the DB connection pool
import { getUserSettings, upsertUserSettings } from '../models/userSettings.model.js';

const UserSettingsController = {
  // Get full settings
  getSettings: async (req, res) => {
    try {
      const userId = req.user.id;
      const settings = await getUserSettings(userId);
      res.status(200).json(settings || {});
    } catch (error) {
      console.error('Error fetching user settings:', error);
      res.status(500).json({ message: 'Failed to fetch user settings' });
    }
  },

  // Update username (Account Tab)
  updateAccount: async (req, res) => {
    try {
      const { username } = req.body;
      await pool.query(`UPDATE users SET username = $1 WHERE id = $2`, [username, req.user.id]);
      res.status(200).json({ message: 'Account updated' });
    } catch (error) {
      console.error('Error updating account:', error);
      res.status(500).json({ message: 'Failed to update account' });
    }
  },

  // Update notification preferences (Notification Tab)
  updateNotifications: async (req, res) => {
    try {
      await upsertUserSettings(req.user.id, { notifications: req.body });
      res.status(200).json({ message: 'Notification preferences updated' });
    } catch (error) {
      console.error('Error updating notifications:', error);
      res.status(500).json({ message: 'Failed to update notifications' });
    }
  },

  // Update display settings (Display Tab)
  updateDisplay: async (req, res) => {
    try {
      await upsertUserSettings(req.user.id, { display: req.body });
      res.status(200).json({ message: 'Display settings updated' });
    } catch (error) {
      console.error('Error updating display settings:', error);
      res.status(500).json({ message: 'Failed to update display settings' });
    }
  },

  // Update wallet address (Wallet Tab)
  updateWallet: async (req, res) => {
    try {
      const { wallet_address } = req.body;
      await upsertUserSettings(req.user.id, { wallet_address });
      await pool.query(`UPDATE users SET wallet_address = $1 WHERE id = $2`, [wallet_address, req.user.id]);
      res.status(200).json({ message: 'Wallet address updated' });
    } catch (error) {
      console.error('Error updating wallet:', error);
      res.status(500).json({ message: 'Failed to update wallet address' });
    }
  },
};

export default UserSettingsController;
