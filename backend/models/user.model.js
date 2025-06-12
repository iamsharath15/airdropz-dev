// done v1

import pool from "../config/db.js";

export async function createUsersTable() {
  try {
    // Enable pgcrypto extension for UUID generation (if not already enabled)
    await pool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

    // Create users table with UUIDs and relevant metadata
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        user_name VARCHAR(100) NOT NULL,
        referral_code VARCHAR(50) UNIQUE,
        points INT DEFAULT 0,
        last_login TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        daily_login_streak_count INT DEFAULT 0,
        airdrops_earned INT DEFAULT 0,
        airdrops_remaining INT DEFAULT 0,
        is_verified BOOLEAN DEFAULT false,
        is_new_user BOOLEAN DEFAULT true,
        reset_password_token TEXT,
        reset_password_expires_at TIMESTAMPTZ,
        verification_token TEXT,
        verification_token_expires_at TIMESTAMPTZ,
        role VARCHAR(20) DEFAULT 'user',
        heard_from VARCHAR(100),
        interests TEXT,
        experience_level VARCHAR(50),
        wallet_address VARCHAR(100),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);
    `;
    await pool.query(createTableQuery);

    // Create or update trigger function to manage updated_at
    const createTriggerFunctionQuery = `
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `;
    await pool.query(createTriggerFunctionQuery);

    // Ensure the trigger exists
    const createTriggerQuery = `
      DROP TRIGGER IF EXISTS set_timestamp ON users;
      CREATE TRIGGER set_timestamp
      BEFORE UPDATE ON users
      FOR EACH ROW
      EXECUTE PROCEDURE update_updated_at_column();
    `;
    await pool.query(createTriggerQuery);

    console.log("✅ users table created with UUID, indexes, and timestamp trigger");
  } catch (error) {
    console.error("❌ Error creating users table:", error);
    throw error;
  }
}
