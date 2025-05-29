import pool from '../config/db.js';

export async function createDailyLoginStreaksTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS daily_login_streaks (
      user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      streak_count INT DEFAULT 1,
      last_login_date DATE NOT NULL DEFAULT CURRENT_DATE,
      points INT DEFAULT 0,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await pool.query(query);
  console.log('✅ daily_login_streaks table created');
}
