import pool from '../config/db.js';
import { createUserNotification } from '../services/notificationService.js';

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
      sub_tasks = [],
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
        const { title, description, sub_task_image, completed } = sub;
        await client.query(
          `INSERT INTO sub_tasks (
          weekly_task_id, title, description, sub_task_image, completed
        ) VALUES ($1, $2, $3, $4, $5);`,
          [
            weeklyTaskId,
            title,
            description || null,
            sub_task_image || null,
            completed,
          ]
        );
      }

      //   for (const sub of task.sub_tasks || []) {
      //     await client.query(
      //       `INSERT INTO sub_tasks (task_id, title, sub_task_image)
      //        VALUES ($1, $2, $3);`,
      //       [taskRes.rows[0].id, sub.title, sub.sub_task_image]
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

        -- tasks array
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

        -- sub_tasks array
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', st.id,
              'title', st.title,
              'description', st.description,
              'sub_task_image', st.sub_task_image,
              'completed', st.completed
            )
          ) FILTER (WHERE st.id IS NOT NULL),
          '[]'
        ) AS sub_tasks,

        -- user count
        COUNT(DISTINCT ut.user_id) AS user_count,

        -- top 5 user images
        COALESCE((
          SELECT json_agg(u_data) FROM (
            SELECT DISTINCT ON (u.id)
              jsonb_build_object(
                'user_id', u.id,
                'user_name', u.user_name,
                'profile_image', u.profile_image
              ) AS u_data
            FROM user_tasks ut2
            JOIN users u ON u.id = ut2.user_id
            WHERE ut2.weekly_task_id = wt.id
            LIMIT 5
          ) sub
        ), '[]') AS user_images

      FROM weekly_tasks wt
      LEFT JOIN tasks t ON t.weekly_task_id = wt.id
      LEFT JOIN sub_tasks st ON st.weekly_task_id = wt.id
      LEFT JOIN user_tasks ut ON ut.weekly_task_id = wt.id

      GROUP BY wt.id
      ORDER BY wt.created_at DESC;
    `);

      res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
      console.error('❌ getAll error:', error);
      res
        .status(500)
        .json({ success: false, message: 'Failed to fetch weekly tasks' });
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
              'sub_task_image', st.sub_task_image,
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
        return res
          .status(404)
          .json({ success: false, message: 'Weekly task not found' });
      }

      res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error('❌ getById error:', error);
      res
        .status(500)
        .json({ success: false, message: 'Failed to fetch weekly task' });
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
        return res
          .status(404)
          .json({ success: false, message: 'Weekly task not found' });
      }

      // Delete old tasks
      await client.query(`DELETE FROM tasks WHERE weekly_task_id = $1`, [id]);
      // await client.query(`DELETE FROM sub_tasks WHERE weekly_task_id = $1`, [
      //   id,
      // ]);

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
  const { id: subTaskId, title, description, sub_task_image, completed } = sub;

  if (subTaskId) {
    // Update existing sub-task
    await client.query(
      `UPDATE sub_tasks
       SET title = $1,
           description = $2,
           sub_task_image = $3,
           completed = $4
       WHERE id = $5 AND weekly_task_id = $6`,
      [title, description || null, sub_task_image || null, completed, subTaskId, id]
    );
  } else {
    // Insert new sub-task
    await client.query(
      `INSERT INTO sub_tasks (weekly_task_id, title, description, sub_task_image, completed)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, title, description || null, sub_task_image || null, completed]
    );
  }
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
              'sub_task_image', st.sub_task_image,
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
      console.error('❌ update error:', error);
      res
        .status(500)
        .json({ success: false, message: 'Failed to update weekly task' });
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
        return res
          .status(404)
          .json({ success: false, message: 'Weekly task not found' });
      }

      await client.query('COMMIT');
      res.status(200).json({ success: true, message: 'Weekly task deleted' });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ delete error:', error);
      res
        .status(500)
        .json({ success: false, message: 'Failed to delete weekly task' });
    } finally {
      client.release();
    }
  }

static async userTaskCheckList(req, res) {
  const user_id = req.user.userId;
  const { weekly_task_id } = req.params;
  const { sub_task_id, image_url } = req.body;
  const client = await pool.connect();

  if (!sub_task_id || !image_url || !weekly_task_id) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    await client.query('BEGIN');

    // 1. Mark sub-task as completed
    const insertQuery = `
      INSERT INTO user_sub_tasks (
        user_id,
        sub_task_id,
        weekly_task_id,
        sub_task_image,
        is_completed,
        completed_at
      )
      VALUES ($1, $2, $3, $4, true, NOW())
      ON CONFLICT (user_id, sub_task_id)
      DO UPDATE SET
        sub_task_image = EXCLUDED.sub_task_image,
        is_completed = true,
        completed_at = NOW();
    `;
    await client.query(insertQuery, [user_id, sub_task_id, weekly_task_id, image_url]);

    // 2. Add 10 points
    await client.query(`UPDATE leaderboard SET points = points + 10 WHERE user_id = $1`, [user_id]);
    await client.query(`UPDATE users SET airdrops_earned = airdrops_earned + 10 WHERE id = $1`, [user_id]);

    // 3. Fetch updated stats
    const leaderboardRes = await client.query(`SELECT points FROM leaderboard WHERE user_id = $1`, [user_id]);
    const userRes = await client.query(`SELECT airdrops_earned, user_name FROM users WHERE id = $1`, [user_id]);

    const userName = userRes.rows[0]?.user_name || 'User';
    const airdrops_earned = userRes.rows[0]?.airdrops_earned || 0;
    const points = leaderboardRes.rows[0]?.points || 0;

    // 4. Fetch weekly task title
    const taskTitleRes = await client.query(
      `SELECT task_title FROM weekly_tasks WHERE id = $1`,
      [weekly_task_id]
    );
    const taskTitle = taskTitleRes.rows[0]?.task_title || 'Weekly Task';

    // 5. Send notification
    await createUserNotification({
      user_id: user_id,
      type: 'task',
      title: `You earned 10 points!`,
      message: `Great job on completing a sub-task in "${taskTitle}". Keep going, ${userName}!`,
      target_url: `/dashboard/user/weeklytask/${weekly_task_id}`,
      points_earned: 10,
    });

    await client.query('COMMIT');

    return res.status(200).json({
      success: true,
      message: 'Task marked as completed and points awarded',
      data: { points, airdrops_earned },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error in userTaskCheckList:', error);
    return res.status(500).json({ success: false, message: 'Failed to update task checklist' });
  } finally {
    client.release();
  }
}


  static async getUserTaskStatus(req, res) {
    const user_id = req.user.userId; // from auth middleware
    const { weekly_task_id } = req.params;
    const client = await pool.connect();

    try {
      const result = await client.query(
        `SELECT sub_task_id, is_completed, sub_task_image, completed_at
       FROM user_sub_tasks
       WHERE user_id = $1 AND weekly_task_id = $2`,
        [user_id, weekly_task_id]
      );

      return res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
      console.error('❌ Error in getUserTaskStatus:', error);
      return res
        .status(500)
        .json({ success: false, message: 'Failed to fetch user task status' });
    } finally {
      client.release();
    }
  }
  static async getWeeklyTaskWithUserProgress(req, res) {
    const user_id = req.user.userId; // Auth middleware should set this
    const { weekly_task_id } = req.params;
    const client = await pool.connect();

    try {
      const result = await client.query(
        `
      SELECT 
        wt.*,

        -- Total users who started the task
        (
          SELECT COUNT(DISTINCT ut.user_id)
          FROM user_tasks ut
          WHERE ut.weekly_task_id = wt.id
        ) AS total_users_started,

        -- Tasks for this weekly task
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

        -- Sub-tasks and user's completion data
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', st.id,
              'title', st.title,
              'description', st.description,
              'sub_task_image', COALESCE(ust.sub_task_image, st.sub_task_image),
              'completed', COALESCE(ust.is_completed, false),
              'completed_at', ust.completed_at
            )
          ) FILTER (WHERE st.id IS NOT NULL),
          '[]'
        ) AS sub_tasks

      FROM weekly_tasks wt
      LEFT JOIN tasks t ON t.weekly_task_id = wt.id
      LEFT JOIN sub_tasks st ON st.weekly_task_id = wt.id
      LEFT JOIN user_sub_tasks ust 
        ON ust.sub_task_id = st.id AND ust.user_id = $2
      WHERE wt.id = $1
      GROUP BY wt.id;
      `,
        [weekly_task_id, user_id]
      );

      if (!result.rows.length) {
        return res
          .status(404)
          .json({ success: false, message: 'Weekly task not found' });
      }

      return res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error('❌ getWeeklyTaskWithUserProgress error:', error);
      return res
        .status(500)
        .json({ success: false, message: 'Failed to fetch weekly task' });
    } finally {
      client.release();
    }
  }

  static async getTopWeeklyTask(req, res) {
    const client = await pool.connect();

    try {
      const result = await client.query(
        `
      SELECT 
        wt.id,
        wt.start_time,
        wt.end_time,
        wt.week,
        wt.task_title,
        wt.task_banner_image,
        wt.task_category,


        -- Total number of unique users
        COUNT(DISTINCT ut.user_id) AS user_count,

        -- Array of user { id, profile_image }
        COALESCE(
          json_agg(DISTINCT jsonb_build_object(
            'user_id', u.id,
            'user_name', u.user_name,
            'profile_image', u.profile_image
          )) FILTER (WHERE u.id IS NOT NULL),
          '[]'
        ) AS user_images

      FROM user_tasks ut
      JOIN weekly_tasks wt ON wt.id = ut.weekly_task_id
      JOIN users u ON u.id = ut.user_id
      GROUP BY wt.id
      ORDER BY wt.start_time DESC;
      `
      );

      return res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
      console.error('❌ getTopWeeklyTask error:', error);
      return res
        .status(500)
        .json({ success: false, message: 'Failed to fetch weekly tasks' });
    } finally {
      client.release();
    }
  }
}

export default WeeklyTaskController;
