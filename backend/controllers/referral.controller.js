// done v1

import pool from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.js';

class ReferralController {
  static async getReferralStats(req, res) {
    const user_id = req.user.userId;

    try {
      const userRes = await pool.query(
        `SELECT referral_code FROM profiles WHERE user_id = $1`,
        [user_id]
      );

      const { referral_code } = userRes.rows[0];

      const referrals = await pool.query(
        `
        SELECT u.user_name, p.profile_image, r.created_at
        FROM referrals r
        JOIN users u ON r.referred_id = u.id
        JOIN profiles p ON p.user_id = u.id
        WHERE r.referrer_id = $1
        ORDER BY r.created_at DESC
        `,
        [user_id]
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
      };
      return sendSuccess(
        res,
        userDetails,
        'Users who joined using your referral code',
        200
      );
    } catch (error) {
      return sendError(res, 'Failed to fetch referral data', 500, error);
    }
  }
}

export default ReferralController;
