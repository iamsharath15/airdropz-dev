import pool from '../config/db.js';

class UserTasksController {
  static async addTask(req, res) {
    const userId = req.user.userId;
    const { weeklyTaskId } = req.params;

    try {
      const result = await pool.query(
        `INSERT INTO user_tasks (user_id, weekly_task_id)
         VALUES ($1, $2)
         ON CONFLICT (user_id, weekly_task_id) DO NOTHING
         RETURNING *`,
        [userId, weeklyTaskId]
      );

      if (result.rowCount === 0) {
        return res.status(200).json({ message: 'Task already added' });
      }

      return res.status(201).json({ message: 'Task added successfully', task: result.rows[0] });
    } catch (err) {
      console.error('[❌ addTask]', err.message);
      return res.status(500).json({ message: 'Server Error' });
    }
  }

  static async removeTask(req, res) {
    const userId = req.user.userId;
    const { weeklyTaskId } = req.params;

    try {
      const result = await pool.query(
        `DELETE FROM user_tasks
         WHERE user_id = $1 AND weekly_task_id = $2
         RETURNING *`,
        [userId, weeklyTaskId]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Task not found' });
      }

      return res.status(200).json({ message: 'Task removed successfully' });
    } catch (err) {
      console.error('[❌ removeTask]', err.message);
      return res.status(500).json({ message: 'Server Error' });
    }
  }

  // static async getUserTasks(req, res) {
  //   const userId = req.user.userId;

  //   try {
  //     const result = await pool.query(
  //       `SELECT wt.*
  //        FROM user_tasks ut
  //        JOIN weekly_tasks wt ON ut.weekly_task_id = wt.id
  //        WHERE ut.user_id = $1
  //        ORDER BY ut.created_at DESC`,
  //       [userId]
  //     );

  //     return res.status(200).json({ tasks: result.rows });
  //   } catch (err) {
  //     console.error('[❌ getUserTasks]', err.message);
  //     return res.status(500).json({ message: 'Server Error' });
  //   }
  // }

static async getAllUserTasks(req, res) {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `
      SELECT 
        wt.id,
        wt.week,
        wt.task_category,
        wt.task_title,
        wt.start_time,
        wt.end_time,
        wt.task_banner_image,
        wt.task_description,
        wt.created_at,
        wt.updated_at,

        -- Content Blocks (tasks)
        COALESCE(
          json_agg(DISTINCT jsonb_build_object(
            'id', t.id,
            'link', t.link,
            'type', t.type,
            'value', t.value
          )) FILTER (WHERE t.id IS NOT NULL), '[]'
        ) AS tasks,

        -- Sub Tasks with user-specific completed status
        COALESCE(
          json_agg(DISTINCT jsonb_build_object(
            'id', st.id,
            'title', st.title,
            'completed', COALESCE(ust.is_completed, false),
            'description', st.description,
            'sub_task_image', st.sub_task_image
          )) FILTER (WHERE st.id IS NOT NULL), '[]'
        ) AS sub_tasks

      FROM user_tasks ut
      JOIN weekly_tasks wt ON ut.weekly_task_id = wt.id
      LEFT JOIN tasks t ON t.weekly_task_id = wt.id
      LEFT JOIN sub_tasks st ON st.weekly_task_id = wt.id
      LEFT JOIN user_sub_tasks ust 
        ON ust.sub_task_id = st.id AND ust.user_id = $1

      WHERE ut.user_id = $1
      GROUP BY wt.id
      ORDER BY wt.created_at DESC;
    `,
      [userId]
    );

    return res.status(200).json({ success: true, tasks: result.rows });
  } catch (err) {
    console.error('[❌ getAllUserTasks]', err.message);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
}



  // static async getTopAddedTasks(req, res) {
  //   try {
  //     const result = await pool.query(`
  //       SELECT 
  //         wt.id,
  //         wt.title,
  //         wt.category,
  //         wt.banner_image_url,
  //         wt.week,
  //         COUNT(ut.*) AS added_count
  //       FROM weekly_tasks wt
  //       JOIN user_tasks ut ON wt.id = ut.weekly_task_id
  //       GROUP BY wt.id
  //       ORDER BY added_count DESC
  //       LIMIT 10
  //     `);

  //     return res.status(200).json({
  //       message: 'Top added weekly tasks fetched successfully',
  //       data: result.rows,
  //     });
  //   } catch (err) {
  //     console.error('[❌ getTopAddedTasks]', err.message);
  //     return res.status(500).json({ message: 'Server Error' });
  //   }
  // }
}

export default UserTasksController;
