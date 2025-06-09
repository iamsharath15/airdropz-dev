import pool from "../config/db.js";

export async function createStreaksTables() {
  try {
    // 1. Create the table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_logins (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        login_date DATE NOT NULL,
        streak_count INTEGER DEFAULT 1,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Create unique index on (user_id, login_date)
    await pool.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_user_login_date ON user_logins(user_id, login_date);
    `);

    // 3. Create normal index on user_id (optional for performance)
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_user_id ON user_logins(user_id);
    `);

    console.log("✅ user_logins table and indexes created successfully.");
  } catch (error) {
    console.error("❌ Error creating user_logins table:", error);
    throw error;
  }
}
