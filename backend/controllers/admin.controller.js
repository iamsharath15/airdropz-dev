import pool from '../config/db.js';
import { sendSuccess } from '../utils/response.js';

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
  static async getAllUsers(req, res) {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.per_page) || 10;
    const offset = (page - 1) * perPage;

    try {
      // Get total count
      const countResult = await pool.query('SELECT COUNT(*) FROM users');
      const total = parseInt(countResult.rows[0].count, 10);

      // Get paginated data
      const result = await pool.query(
        `
        SELECT 
          user_name, 
          email, 
          airdrops_earned, 
          daily_login_streak_count 
        FROM users
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
        `,
        [perPage, offset]
      );

      const users = result.rows;

      return sendSuccess(
        res,
        users,
        users.length > 0 ? 'Users fetched successfully' : 'No users found.',
        200,
        {
          meta: {
            page,
            per_page: perPage,
            total,
          },
        }
      );
    } catch (error) {
      return sendError(res, 'Failed to fetch users', 500, error);
    }
  }
}

export default AdminController;
