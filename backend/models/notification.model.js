// src/models/createNotificationsTable.ts
import pool from '../config/db.js';

export async function createNotificationsTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        type TEXT NOT NULL, -- 'airdrop', 'task', 'points'
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        target_url TEXT,
        is_read BOOLEAN DEFAULT false,
        points_earned INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await pool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);
    await pool.query(query);

    // Trigger for updated_at
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await pool.query(`
      DROP TRIGGER IF EXISTS set_timestamp_notifications ON notifications;
      CREATE TRIGGER set_timestamp_notifications
      BEFORE UPDATE ON notifications
      FOR EACH ROW
      EXECUTE PROCEDURE update_updated_at_column();
    `);

    console.log('notifications table created.');
  } catch (error) {
    console.error('Failed to create notifications table:', error);
  }
}
