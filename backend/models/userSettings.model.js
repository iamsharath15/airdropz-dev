import pool from '../config/db.js';

export async function createUserSettingsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS user_settings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      notifications JSONB DEFAULT '{}',
      display JSONB DEFAULT '{}',
      wallet_address TEXT,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    CREATE OR REPLACE FUNCTION update_user_settings_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS set_user_settings_timestamp ON user_settings;

    CREATE TRIGGER set_user_settings_timestamp
    BEFORE UPDATE ON user_settings
    FOR EACH ROW
    EXECUTE PROCEDURE update_user_settings_timestamp();
  `;

  await pool.query(query);
  console.log("✅ user_settings table created");
}

export async function getUserSettings(userId) {
  const res = await pool.query(`SELECT * FROM user_settings WHERE user_id = $1`, [userId]);
  return res.rows[0];
}

export async function upsertUserSettings(userId, updates) {
  const {
    notifications = null,
    display = null,
    wallet_address = null,
  } = updates;

  const existing = await getUserSettings(userId);

  if (!existing) {
    await pool.query(
      `INSERT INTO user_settings (user_id, notifications, display, wallet_address) VALUES ($1, $2, $3, $4)`,
      [userId, notifications, display, wallet_address]
    );
  } else {
    await pool.query(
      `UPDATE user_settings SET
        notifications = COALESCE($2, notifications),
        display = COALESCE($3, display),
        wallet_address = COALESCE($4, wallet_address)
      WHERE user_id = $1`,
      [userId, notifications, display, wallet_address]
    );
  }
}
