import pool from "../config/db.js";

class WeeklyTaskController {
  // 1. CREATE a Weekly Task with nested Tasks and Sub-Tasks
  static async create(req, res) {
    const client = await pool.connect();
    const { banner_image, week, type, title, description, tasks = [] } = req.body;

    try {
      await client.query("BEGIN");

      const weeklyTaskRes = await client.query(
        `INSERT INTO weekly_tasks (banner_image, week, type, title, description)
         VALUES ($1, $2, $3, $4, $5) RETURNING id;`,
        [banner_image, week, type, title, description]
      );

      const weeklyTaskId = weeklyTaskRes.rows[0].id;

      for (const task of tasks) {
        const taskRes = await client.query(
          `INSERT INTO tasks (weekly_task_id, title, description)
           VALUES ($1, $2, $3) RETURNING id;`,
          [weeklyTaskId, task.title, task.description]
        );

        for (const sub of task.sub_tasks || []) {
          await client.query(
            `INSERT INTO sub_tasks (task_id, title, hyperlink)
             VALUES ($1, $2, $3);`,
            [taskRes.rows[0].id, sub.title, sub.hyperlink]
          );
        }
      }

      await client.query("COMMIT");
      res.status(201).json({ success: true, id: weeklyTaskId });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("create error:", error);
      res.status(500).json({ success: false, message: "Failed to create weekly task" });
    } finally {
      client.release();
    }
  }

  // 2. GET ALL Weekly Tasks with nested Tasks and Sub-Tasks
  static async getAll(req, res) {
    try {
      const result = await pool.query(`
        SELECT wt.*, 
          json_agg(
            json_build_object(
              'id', t.id,
              'title', t.title,
              'description', t.description,
              'sub_tasks', (
                SELECT json_agg(json_build_object('id', st.id, 'title', st.title, 'hyperlink', st.hyperlink))
                FROM sub_tasks st WHERE st.task_id = t.id
              )
            )
          ) AS tasks
        FROM weekly_tasks wt
        LEFT JOIN tasks t ON t.weekly_task_id = wt.id
        GROUP BY wt.id
        ORDER BY wt.created_at DESC;
      `);

      res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
      console.error("getAll error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch weekly tasks" });
    }
  }

  // 3. GET one Weekly Task by ID
  static async getById(req, res) {
    const { id } = req.params;
    try {
      const result = await pool.query(`
        SELECT wt.*, 
          json_agg(
            json_build_object(
              'id', t.id,
              'title', t.title,
              'description', t.description,
              'sub_tasks', (
                SELECT json_agg(json_build_object('id', st.id, 'title', st.title, 'hyperlink', st.hyperlink))
                FROM sub_tasks st WHERE st.task_id = t.id
              )
            )
          ) AS tasks
        FROM weekly_tasks wt
        LEFT JOIN tasks t ON t.weekly_task_id = wt.id
        WHERE wt.id = $1
        GROUP BY wt.id;
      `, [id]);

      if (!result.rows.length) {
        return res.status(404).json({ success: false, message: "Weekly task not found" });
      }

      res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error("getById error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch weekly task" });
    }
  }

  // 4. UPDATE a Weekly Task (only main fields, not nested for simplicity)
  static async update(req, res) {
    const { id } = req.params;
    const { banner_image, week, type, title, description } = req.body;

    try {
      const result = await pool.query(
        `UPDATE weekly_tasks
         SET banner_image = $1,
             week = $2,
             type = $3,
             title = $4,
             description = $5,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $6
         RETURNING *;`,
        [banner_image, week, type, title, description, id]
      );

      if (!result.rows.length) {
        return res.status(404).json({ success: false, message: "Weekly task not found" });
      }

      res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error("update error:", error);
      res.status(500).json({ success: false, message: "Failed to update weekly task" });
    }
  }

  // 5. DELETE a Weekly Task and cascade delete tasks/sub-tasks
  static async delete(req, res) {
    const { id } = req.params;

    try {
      const result = await pool.query(
        `DELETE FROM weekly_tasks WHERE id = $1 RETURNING *;`,
        [id]
      );

      if (!result.rows.length) {
        return res.status(404).json({ success: false, message: "Weekly task not found" });
      }

      res.status(200).json({ success: true, message: "Weekly task deleted" });
    } catch (error) {
      console.error("delete error:", error);
      res.status(500).json({ success: false, message: "Failed to delete weekly task" });
    }
  }
}

export default WeeklyTaskController;
