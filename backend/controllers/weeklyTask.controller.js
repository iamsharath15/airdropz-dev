import pool from '../config/db.js';

class WeeklyTaskController {
  // 1. CREATE a Weekly Task with nested Tasks and Sub-Tasks
  static async create(req, res) {
    const client = await pool.connect();
    const {
      task_title,
      task_category,
      week,
      start_time,
      end_time,
      task_banner_image,
      task_description,
      tasks = [],
      sub_tasks= []
    } = req.body;

    try {
      await client.query('BEGIN');

      const weeklyTaskRes = await client.query(
        `INSERT INTO weekly_tasks (task_title, task_category, week, start_time, end_time, task_banner_image, task_description)
   VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;`,
        [
          task_title,
          task_category,
          week,
          start_time,
          end_time,
          task_banner_image || null,
          task_description || null,
        ]
      );
    const weeklyTaskId = weeklyTaskRes.rows[0].id; // ✅ fix: define this before using

     // Insert each task linked to weekly_task_id
    for (const task of tasks) {
      const { type, value, link } = task;
      await client.query(
        `INSERT INTO tasks (
          weekly_task_id, type, value, link
        ) VALUES ($1, $2, $3, $4);`,
        [weeklyTaskId, type, value, link || null]
      );
    }
    for (const sub of sub_tasks) {
      const { title, description, hyperlink, completed } = sub;
      await client.query(
        `INSERT INTO sub_tasks (
          weekly_task_id, title, description, hyperlink, completed
        ) VALUES ($1, $2, $3, $4, $5);`,
        [weeklyTaskId, title, description || null, hyperlink || null, completed]
      );
    }


      //   for (const sub of task.sub_tasks || []) {
      //     await client.query(
      //       `INSERT INTO sub_tasks (task_id, title, hyperlink)
      //        VALUES ($1, $2, $3);`,
      //       [taskRes.rows[0].id, sub.title, sub.hyperlink]
      //     );
      //   }
      // }

      await client.query('COMMIT');
      res.status(201).json({ success: true, id: weeklyTaskId });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('create error:', error);
      res
        .status(500)
        .json({ success: false, message: 'Failed to create weekly task' });
    } finally {
      client.release();
    }
  }

  // 2. GET ALL Weekly Tasks with nested Tasks and Sub-Tasks
static async getAll(req, res) {
  try {
    const result = await pool.query(`
      SELECT 
        wt.*,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', t.id,
              'type', t.type,
              'value', t.value,
              'link', t.link
            )
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'
        ) AS tasks,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', st.id,
              'title', st.title,
              'description', st.description,
              'hyperlink', st.hyperlink,
              'completed', st.completed
            )
          ) FILTER (WHERE st.id IS NOT NULL),
          '[]'
        ) AS sub_tasks
      FROM weekly_tasks wt
      LEFT JOIN tasks t ON t.weekly_task_id = wt.id
      LEFT JOIN sub_tasks st ON st.weekly_task_id = wt.id
      GROUP BY wt.id
      ORDER BY wt.created_at DESC;
    `);

    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error('❌ getAll error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch weekly tasks' });
  }
}



  // 3. GET one Weekly Task by ID
static async getById(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        wt.*,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', t.id,
              'type', t.type,
              'value', t.value,
              'link', t.link
            )
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'
        ) AS tasks,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', st.id,
              'title', st.title,
              'description', st.description,
              'hyperlink', st.hyperlink,
              'completed', st.completed
            )
          ) FILTER (WHERE st.id IS NOT NULL),
          '[]'
        ) AS sub_tasks
      FROM weekly_tasks wt
      LEFT JOIN tasks t ON t.weekly_task_id = wt.id
      LEFT JOIN sub_tasks st ON st.weekly_task_id = wt.id
      WHERE wt.id = $1
      GROUP BY wt.id;
      `,
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ success: false, message: "Weekly task not found" });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("❌ getById error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch weekly task" });
  }
}



  //4. UPDATE a Weekly Task (only main fields, not nested for simplicity)
// 4. UPDATE a Weekly Task along with its nested tasks
// 4. UPDATE a Weekly Task along with its nested tasks, and return full updated data
static async update(req, res) {
  const { id } = req.params;
  const {
    task_title,
    task_category,
    week,
    start_time,
    end_time,
    task_banner_image,
    task_description,
    tasks = [],
        sub_tasks = [],

  } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Update the main weekly task fields
    const result = await client.query(
      `UPDATE weekly_tasks
       SET task_title = $1,
           task_category = $2,
           week = $3,
           start_time = $4,
           end_time = $5,
           task_banner_image = $6,
           task_description = $7,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *;`,
      [
        task_title,
        task_category,
        week,
        start_time,
        end_time,
        task_banner_image || null,
        task_description || null,
        id,
      ]
    );

    if (!result.rows.length) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: "Weekly task not found" });
    }

    // Delete old tasks
    await client.query(`DELETE FROM tasks WHERE weekly_task_id = $1`, [id]);
    await client.query(`DELETE FROM sub_tasks WHERE weekly_task_id = $1`, [id]);

    // Insert new tasks
    for (const task of tasks) {
      const { type, value, link } = task;
      await client.query(
        `INSERT INTO tasks (weekly_task_id, type, value, link)
         VALUES ($1, $2, $3, $4);`,
        [id, type, value || '', link || null]
      );
    }
   for (const sub of sub_tasks) {
      const { title, description, hyperlink, completed } = sub;
      await client.query(
        `INSERT INTO sub_tasks (weekly_task_id, title, description, hyperlink, completed)
         VALUES ($1, $2, $3, $4, $5);`,
        [id, title, description || null, hyperlink || null, completed]
      );
    }
    // Fetch full updated weekly task including tasks
  const fullData = await client.query(
      `
      SELECT 
        wt.*,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', t.id,
              'type', t.type,
              'value', t.value,
              'link', t.link
            )
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'
        ) AS tasks,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', st.id,
              'title', st.title,
              'description', st.description,
              'hyperlink', st.hyperlink,
              'completed', st.completed
            )
          ) FILTER (WHERE st.id IS NOT NULL),
          '[]'
        ) AS sub_tasks
      FROM weekly_tasks wt
      LEFT JOIN tasks t ON t.weekly_task_id = wt.id
      LEFT JOIN sub_tasks st ON st.weekly_task_id = wt.id
      WHERE wt.id = $1
      GROUP BY wt.id;
      `,
      [id]
    );


    await client.query('COMMIT');
    res.status(200).json({ success: true, data: fullData.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("❌ update error:", error);
    res.status(500).json({ success: false, message: "Failed to update weekly task" });
  } finally {
    client.release();
  }
}




  // 5. DELETE a Weekly Task and cascade delete tasks/sub-tasks
 static async delete(req, res) {
    const { id } = req.params;
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Optionally delete tasks explicitly if no ON DELETE CASCADE
      await client.query(`DELETE FROM tasks WHERE weekly_task_id = $1`, [id]);

      const result = await client.query(
        `DELETE FROM weekly_tasks WHERE id = $1 RETURNING *;`,
        [id]
      );

      if (!result.rows.length) {
        await client.query('ROLLBACK');
        return res.status(404).json({ success: false, message: 'Weekly task not found' });
      }

      await client.query('COMMIT');
      res.status(200).json({ success: true, message: 'Weekly task deleted' });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ delete error:', error);
      res.status(500).json({ success: false, message: 'Failed to delete weekly task' });
    } finally {
      client.release();
    }
  }
}

export default WeeklyTaskController;
