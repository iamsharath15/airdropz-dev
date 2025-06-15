import pool from '../config/db.js';

export async function createUserAirdropsTable() {
  await pool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

  const query = `
    CREATE TABLE IF NOT EXISTS user_airdrops (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      airdrop_id UUID NOT NULL REFERENCES airdrops(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, airdrop_id)
    );

    CREATE INDEX IF NOT EXISTS idx_user_airdrops_user_id ON user_airdrops(user_id);
    CREATE INDEX IF NOT EXISTS idx_user_airdrops_airdrop_id ON user_airdrops(airdrop_id);
  `;

  await pool.query(query);

  // Trigger function for updated_at
  await pool.query(`
    CREATE OR REPLACE FUNCTION update_user_airdrops_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE 'plpgsql';

    DROP TRIGGER IF EXISTS set_user_airdrops_timestamp ON user_airdrops;
    CREATE TRIGGER set_user_airdrops_timestamp
    BEFORE UPDATE ON user_airdrops
    FOR EACH ROW
    EXECUTE PROCEDURE update_user_airdrops_updated_at_column();
  `);

  console.log('✅ user_airdrops table created with timestamp trigger');
}
