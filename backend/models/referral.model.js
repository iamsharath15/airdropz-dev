import pool from "../config/db.js";

export async function createReferralsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS referrals (
      id SERIAL PRIMARY KEY,
      referrer_id INT REFERENCES users(id) ON DELETE CASCADE,
      referred__id INT REFERENCES users(id) ON DELETE CASCADE,
      referral_code_used VARCHAR(20),
      points_awarded_to_referrer INT DEFAULT 50,
      points_awarded_to_referred INT DEFAULT 25,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await pool.query(query);
  console.log("✅ referrals table created");
}
