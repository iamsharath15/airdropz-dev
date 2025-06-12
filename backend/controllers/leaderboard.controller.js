import pool from '../config/db.js';

class LeaderboardController {
  static async getLeaderboard(req, res) {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    try {
      const dataQuery = `
        SELECT 
          l.id,
          l.user_id,
          u.user_name,
          l.points,
          l.updated_at
        FROM leaderboard l
        JOIN users u ON l.user_id = u.id
        ORDER BY l.points DESC
        LIMIT $1 OFFSET $2;
      `;

      const countQuery = `
        SELECT COUNT(*) FROM leaderboard;
      `;

      const [dataResult, countResult] = await Promise.all([
        pool.query(dataQuery, [limit, offset]),
        pool.query(countQuery),
      ]);

      const totalCount = parseInt(countResult.rows[0].count, 10);

      res.status(200).json({
        success: true,
        data: dataResult.rows,
        totalCount,
      });
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }
}

export default LeaderboardController;
