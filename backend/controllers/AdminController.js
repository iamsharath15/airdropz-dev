import pool from '../config/db.js';

class AdminController {
  static async getDashboardStats(req, res) {
    try {
      const client = await pool.connect();

      const [userCountRes, airdropCountRes, taskCountRes] = await Promise.all([
        client.query('SELECT COUNT(*) FROM users'),
        client.query('SELECT COUNT(*) FROM airdrops'),
        client.query('SELECT COUNT(*) FROM weekly_tasks'),
      ]);

      client.release();

      res.status(200).json({
        message: 'Admin stats fetched successfully',
        stats: {
          users: parseInt(userCountRes.rows[0].count, 10),
          airdrops: parseInt(airdropCountRes.rows[0].count, 10),
          tasks: parseInt(taskCountRes.rows[0].count, 10),
        },
      });
    } catch (error) {
      console.error('Admin Stats Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default AdminController;
