import pool from "../config/db.js";

export async function createWeeklyTasksTables() {
  await pool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

  const query = `
    -- Weekly Tasks Table
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

    -- Tasks Table
    CREATE TABLE IF NOT EXISTS tasks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      weekly_task_id UUID REFERENCES weekly_tasks(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    -- Sub Tasks Table
    CREATE TABLE IF NOT EXISTS sub_tasks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      hyperlink TEXT,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    -- Indexes for performance
    CREATE INDEX IF NOT EXISTS idx_weekly_tasks_week ON weekly_tasks(week);
    CREATE INDEX IF NOT EXISTS idx_tasks_weekly_task_id ON tasks(weekly_task_id);
    CREATE INDEX IF NOT EXISTS idx_sub_tasks_task_id ON sub_tasks(task_id);
  `;

  await pool.query(query);

  // Trigger function for updated_at
  await pool.query(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE 'plpgsql';
  `);

  // Triggers
  await pool.query(`
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
  `);

  console.log("✅ weekly_tasks, tasks, sub_tasks tables created with UUID and triggers");
}
