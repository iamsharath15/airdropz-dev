import pool from '../config/db.js';

class LeaderboardController {
  static async getLeaderboard(req, res) {
    try {
      const query = `
        SELECT 
          l.id,
          l.user_id,
          u.user_name,
          l.points,
          l.updated_at
        FROM leaderboard l
        JOIN users u ON l.user_id = u.id
        ORDER BY l.points DESC
        LIMIT 100;
      `;
      const { rows } = await pool.query(query);
      res.status(200).json({ success: true, data: rows });
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }
}

export default LeaderboardController;
