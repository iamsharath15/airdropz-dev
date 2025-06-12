// done v1

import pool from "../config/db.js";

class ReferralController {
  static async getReferralStats(req, res) {
    const userId = req.user.id;

    try {
      const userRes = await pool.query(
        `SELECT referral_code, points FROM users WHERE id = $1`,
        [userId]
      );

      const { referral_code, points } = userRes.rows[0];

      const referrals = await pool.query(
        `
        SELECT u.user_name, r.created_at
        FROM referrals r
        JOIN users u ON r.referred_id = u.id
        WHERE r.referrer_id = $1
        ORDER BY r.created_at DESC
        `,
        [userId]
      );

      res.status(200).json({
        referralCode: referral_code,
        totalReferrals: referrals.rows.length,
        points,
        history: referrals.rows.map((r) => ({
          user_name: r.user_name,
          date: r.created_at,
          pointsEarned: 50,
        })),
      });
    } catch (err) {
      console.error("Error fetching referral stats:", err);
      res.status(500).json({ error: "Failed to fetch referral data" });
    }
  }
}

export default ReferralController;
