import pool from '../config/db.js';

// GET /api/leaderboard
export async function getLeaderboard(req, res) {
  try {
    const result = await pool.query(`
      SELECT l.user_id, u.username, u.email, l.points
      FROM leaderboard l
      JOIN users u ON l.user_id = u.id
      ORDER BY l.points DESC
      LIMIT 100
    `);
    res.status(200).json({ success: true, leaderboard: result.rows });
  } catch (err) {
    console.error('Leaderboard fetch error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// POST /api/leaderboard/add
export async function addPoints(req, res) {
  const { userId, points } = req.body;
  if (!userId || typeof points !== 'number') {
    return res.status(400).json({ success: false, message: 'Missing userId or points' });
  }

  try {
    const existing = await pool.query(`SELECT * FROM leaderboard WHERE user_id = $1`, [userId]);

    if (existing.rows.length > 0) {
      await pool.query(
        `UPDATE leaderboard SET points = points + $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2`,
        [points, userId]
      );
    } else {
      await pool.query(
        `INSERT INTO leaderboard (user_id, points) VALUES ($1, $2)`,
        [userId, points]
      );
    }

    res.status(200).json({ success: true, message: 'Points updated' });
  } catch (err) {
    console.error('Add points error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}
