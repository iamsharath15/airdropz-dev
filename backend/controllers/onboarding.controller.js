import pool from "../config/db.js";

class OnboardingController {
  static async submitOnboarding(req, res) {
    const userId = req.user?.userId; // ✅ FIXED: correct way to access userId
    console.log(userId);
    const { username, heardFrom, interests, experienceLevel, walletAddress } = req.body;

    try {
      const result = await pool.query(
        `UPDATE users SET
          username = $1,
          heard_from = $2,
          interests = $3,
          experience_level = $4,
          wallet_address = $5,
          is_new_user = false,
          updated_at = NOW()
        WHERE id = $6
        RETURNING id, username, email`,
        [username, heardFrom, interests, experienceLevel, walletAddress, userId]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      return res.status(200).json({
        success: true,
        message: "Onboarding completed",
        user: result.rows[0],
      });
    } catch (error) {
      console.error("Error in submitOnboarding:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  static async getOnboarding(req, res) {
    const userId = req.user?.userId;

    try {
      const result = await pool.query(
        `SELECT id, username, email, heard_from, interests, experience_level, wallet_address
         FROM users WHERE id = $1`,
        [userId]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      return res.status(200).json({
        success: true,
        user: result.rows[0],
      });
    } catch (error) {
      console.error("Error in getOnboarding:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
}

export default OnboardingController;
