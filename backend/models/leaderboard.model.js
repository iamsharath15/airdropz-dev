import pool from '../config/db.js';

export async function createLeaderboardTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS leaderboard (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        points INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_leaderboard_user_id ON leaderboard(user_id);
    `;

    await pool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);
    await pool.query(query);

    // Create or replace trigger function for updated_at column
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Create trigger to auto-update updated_at on row update
    await pool.query(`
      DROP TRIGGER IF EXISTS set_timestamp_leaderboard ON leaderboard;
      CREATE TRIGGER set_timestamp_leaderboard
      BEFORE UPDATE ON leaderboard
      FOR EACH ROW
      EXECUTE PROCEDURE update_updated_at_column();
    `);

    console.log('leaderboard table created successfully');
  } catch (error) {
    console.error('Error creating leaderboard table:', error);
    throw error;
  }
}
