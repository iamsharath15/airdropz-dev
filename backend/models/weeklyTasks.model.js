import pool from "../config/db.js";

export async function createWeeklyTasksTables() {
  try {
    // Enable pgcrypto for UUID generation
    await pool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

    // Create Tables
    const createTablesQuery = `
      -- Weekly Tasks
      CREATE TABLE IF NOT EXISTS weekly_tasks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        banner_image TEXT,
        week INT NOT NULL,
        type VARCHAR(50),
        title TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      -- Tasks
      CREATE TABLE IF NOT EXISTS tasks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        weekly_task_id UUID REFERENCES weekly_tasks(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      -- Sub Tasks
      CREATE TABLE IF NOT EXISTS sub_tasks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        hyperlink TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      -- User Sub Tasks (tracking user progress)
      CREATE TABLE IF NOT EXISTS user_sub_tasks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        sub_task_id UUID REFERENCES sub_tasks(id) ON DELETE CASCADE,
        is_completed BOOLEAN DEFAULT false,
        completed_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, sub_task_id)
      );

      -- Indexes
      CREATE INDEX IF NOT EXISTS idx_weekly_tasks_week ON weekly_tasks(week);
      CREATE INDEX IF NOT EXISTS idx_tasks_weekly_task_id ON tasks(weekly_task_id);
      CREATE INDEX IF NOT EXISTS idx_sub_tasks_task_id ON sub_tasks(task_id);
      CREATE INDEX IF NOT EXISTS idx_user_sub_tasks_user_id ON user_sub_tasks(user_id);
    `;

    await pool.query(createTablesQuery);

    // Create common trigger function
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Triggers for updated_at
    const createTriggersQuery = `
      DROP TRIGGER IF EXISTS set_timestamp_weekly ON weekly_tasks;
      CREATE TRIGGER set_timestamp_weekly
      BEFORE UPDATE ON weekly_tasks
      FOR EACH ROW
      EXECUTE PROCEDURE update_updated_at_column();

      DROP TRIGGER IF EXISTS set_timestamp_tasks ON tasks;
      CREATE TRIGGER set_timestamp_tasks
      BEFORE UPDATE ON tasks
      FOR EACH ROW
      EXECUTE PROCEDURE update_updated_at_column();

      DROP TRIGGER IF EXISTS set_timestamp_sub_tasks ON sub_tasks;
      CREATE TRIGGER set_timestamp_sub_tasks
      BEFORE UPDATE ON sub_tasks
      FOR EACH ROW
      EXECUTE PROCEDURE update_updated_at_column();
    `;

    await pool.query(createTriggersQuery);

    console.log("✅ Tables created: weekly_tasks, tasks, sub_tasks, user_sub_tasks (with triggers)");
  } catch (error) {
    console.error("❌ Error creating weekly task tables:", error);
    throw error;
  }
}
