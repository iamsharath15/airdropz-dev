import pool from "../config/db.js";

export async function createUsersTable() {
  // Enable pgcrypto extension for UUID generation
  await pool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      username VARCHAR(100) NOT NULL,
      referral_code VARCHAR(50) UNIQUE,
      points INT DEFAULT 0,
      last_login TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      is_verified BOOLEAN DEFAULT false,
      reset_password_token TEXT,
      reset_password_expires_at TIMESTAMPTZ,
      verification_token TEXT,
      verification_token_expires_at TIMESTAMPTZ,
      role VARCHAR(20) DEFAULT 'user',
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);
  `;

  await pool.query(query);

  // Create trigger for updated_at timestamp
  await pool.query(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE 'plpgsql';

    DROP TRIGGER IF EXISTS set_timestamp ON users;

    CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
  `);

  console.log("✅ users table with UUID created");
}
