// done v1

import pool from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.js';

class ReferralController {
  static async getReferralStats(req, res) {
    const userId = req.user.id;

    try {
      const userRes = await pool.query(
        `SELECT referral_code FROM users WHERE id = $1`,
        [userId]
      );

      const { referral_code} = userRes.rows[0];

      const referrals = await pool.query(
        `
        SELECT u.user_name, u.profile_image, r.created_at
        FROM referrals r
        JOIN users u ON r.referred_id = u.id
        WHERE r.referrer_id = $1
        ORDER BY r.created_at DESC
        `,
        [userId]
      );

      const userDetails = {
        referral_code: referral_code,
        total_referrals: referrals.rows.length,
        user_details: referrals.rows.map((r) => ({
          user_name: r.user_name,
          profile_image: r.profile_image,
          join_date: r.created_at,
          points_earned: 50,
        })),
      }
        return sendSuccess(
        res,
        userDetails,
        'Users who joined using your referral code',
        200
      );
    } catch (err) {
      console.error('Error fetching referral stats:', err);
      res.status(500).json({ error: 'Failed to fetch referral data' });
    }
  }
}

export default ReferralController;
