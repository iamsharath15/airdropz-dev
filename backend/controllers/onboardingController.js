import pool from "../config/db.js";

export const submitOnboarding = async (req, res) => {
  const userId = req.userId; // assume middleware sets this
  const { username, heardFrom, interests, experienceLevel, walletAddress } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users SET
        username = $1,
        heard_from = $2,
        interests = $3,
        experience_level = $4,
        wallet_address = $5,
        updated_at = NOW()
      WHERE id = $6
      RETURNING id, username, email`,
      [username, heardFrom, interests, experienceLevel, walletAddress, userId]
    );
     if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "Onboarding completed", user: result.rows[0] });

  } catch (error) {
    console.error("Error in submitOnboarding", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
