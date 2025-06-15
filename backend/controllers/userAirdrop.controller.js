import pool from '../config/db.js';

class UserAirdropController {
  static async likeAirdrop(req, res) {
    const { airdropId } = req.params;
    const userId = req.user.userId;

    try {
      const result = await pool.query(
        `INSERT INTO user_airdrops (user_id, airdrop_id)
         VALUES ($1, $2)
         ON CONFLICT (user_id, airdrop_id) DO NOTHING
         RETURNING *`,
        [userId, airdropId]
      );

      if (result.rowCount === 0) {
        return res.status(200).json({ message: 'Already liked' });
      }

      res.status(201).json({ message: 'Airdrop liked successfully' });
    } catch (error) {
      console.error('Like Airdrop Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async unlikeAirdrop(req, res) {
    const { airdropId } = req.params;
    const userId = req.user.userId;

    try {
      const result = await pool.query(
        `DELETE FROM user_airdrops
         WHERE user_id = $1 AND airdrop_id = $2
         RETURNING *`,
        [userId, airdropId]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Like not found' });
      }

      res.status(200).json({ message: 'Airdrop unliked successfully' });
    } catch (error) {
      console.error('Unlike Airdrop Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getLikedAirdrops(req, res) {
    const userId = req.user.userId;

    try {
      const result = await pool.query(
        `SELECT a.*
         FROM user_airdrops ua
         JOIN airdrops a ON ua.airdrop_id = a.id
         WHERE ua.user_id = $1
         ORDER BY ua.created_at DESC`,
        [userId]
      );

      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Fetch Liked Airdrops Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

 static async getIsAirdropLikedByUser(req, res) {
  const userId = req.user.userId;
  const { airdropId } = req.params;

  try {
    const result = await pool.query(
      `SELECT 1 FROM user_airdrops WHERE user_id = $1 AND airdrop_id = $2 LIMIT 1`,
      [userId, airdropId]
    );

    const isLiked = result.rows.length > 0;

    return res.status(200).json({ liked: isLiked });
  } catch (error) {
    console.error('Error checking airdrop like status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

}

export default UserAirdropController;
