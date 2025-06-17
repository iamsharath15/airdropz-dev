import pool from "../config/db.js";

export async function createUserTasksTable() {
  try {
    // Ensure pgcrypto extension is enabled for UUID generation
    await pool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS user_tasks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        weekly_task_id UUID REFERENCES weekly_tasks(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE UNIQUE INDEX IF NOT EXISTS idx_user_task_unique ON user_tasks(user_id, weekly_task_id);
    `;

    await pool.query(createTableQuery);
    console.log("✅ user_tasks table created successfully");
  } catch (error) {
    console.error("❌ Error creating user_tasks table:", error);
    throw error;
  }
}
