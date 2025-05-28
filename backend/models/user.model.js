// models/createUsersTable.js
import pool from "../config/db.js";

export async function createUsersTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      username VARCHAR(100) NOT NULL,
      referral_code VARCHAR(50) UNIQUE,
      points INT DEFAULT 0,
      last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      is_verified BOOLEAN DEFAULT false,
      reset_password_token TEXT,
      reset_password_expires_at TIMESTAMP,
      verification_token TEXT,
      verification_token_expires_at TIMESTAMP,
      role VARCHAR(20) DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await pool.query(query);
   // Add a trigger to update `updated_at` automatically on row update (optional but useful)
  await pool.query(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ language 'plpgsql';

    DROP TRIGGER IF EXISTS set_timestamp ON users;

    CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
  `);
  console.log("✅ users table created");
}
