import pool from '../config/db.js';

export async function createProfileTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS profiles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,

      -- Personal Info
      profile_image TEXT,
      referral_code VARCHAR(50) UNIQUE,
      daily_login_streak_count INT DEFAULT 0,
      airdrops_earned INT DEFAULT 0,
      airdrops_remaining INT DEFAULT 0,
      heard_from VARCHAR(100),
      interests TEXT,
      experience_level VARCHAR(50),
      wallet_address VARCHAR(100),
      last_login TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,


      -- Notification preferences
      new_airdrop_alerts BOOLEAN DEFAULT true,
      weekly_reports BOOLEAN DEFAULT true,
      task_reminders BOOLEAN DEFAULT true,

      -- Display preferences
      mode TEXT DEFAULT 'dark',
      language TEXT DEFAULT 'english',

      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    -- Update timestamp function
    CREATE OR REPLACE FUNCTION update_profile_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    -- Drop old trigger if exists (corrected table name)
    DROP TRIGGER IF EXISTS set_profile_timestamp ON profiles;

    -- Create new trigger for updated_at
    CREATE TRIGGER set_profile_timestamp
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE PROCEDURE update_profile_timestamp();
  `;

  await pool.query(query);
  console.log("✅ profiles table created");
}
