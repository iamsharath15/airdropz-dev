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

  await pool.query(`
    CREATE OR REPLACE FUNCTION update_login_streaks_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS trigger_login_streaks_timestamp ON login_streaks;

    CREATE TRIGGER trigger_login_streaks_timestamp
    BEFORE UPDATE ON login_streaks
    FOR EACH ROW
    EXECUTE PROCEDURE update_login_streaks_updated_at();
  `);

  console.log("✅ login_streaks table created");
}
