import pool from "../config/db.js";

export async function createLoginStreaksTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS login_streaks (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      streak_count INTEGER DEFAULT 1,
      last_login_date DATE,
      total_points INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log("✅ login_streaks table created");
}
