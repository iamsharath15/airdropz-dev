import pool from '../config/db.js';

export async function createUserSettingsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS user_settings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      
      -- Notification preferences
      new_airdrop_alerts BOOLEAN DEFAULT true,
      weekly_reports BOOLEAN DEFAULT true,
      task_reminders BOOLEAN DEFAULT true,
      
      -- Display preferences
      mode TEXT DEFAULT 'dark',
      language TEXT DEFAULT 'english',

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
