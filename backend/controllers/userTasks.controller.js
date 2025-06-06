// @desc Get all tasks (and sub-tasks) assigned to a user
// @route GET /api/user-tasks/:userId
// @access Private

import pool from '../config/db.js';

const UserTaskController = {
  async getUserTasks(req, res) {
    const { userId } = req.params;

    try {
      const { rows } = await pool.query(
        `
        SELECT 
          ut.task_id,
          ut.is_completed,
          ut.completed_at,
          t.title AS task_title,
          t.description AS task_description,
          t.weekly_task_id,
          st.id AS sub_task_id,
          st.title AS sub_task_title,
          st.hyperlink
        FROM user_tasks ut
        JOIN tasks t ON ut.task_id = t.id
        LEFT JOIN sub_tasks st ON st.task_id = t.id
        WHERE ut.user_id = $1
        ORDER BY t.created_at ASC, st.created_at ASC;
        `,
        [userId]
      );

      // Group by task_id
      const grouped = {};
      for (const row of rows) {
        if (!grouped[row.task_id]) {
          grouped[row.task_id] = {
            task_id: row.task_id,
            title: row.task_title,
            description: row.task_description,
            is_completed: row.is_completed,
            completed_at: row.completed_at,
            sub_tasks: [],
          };
        }

        if (row.sub_task_id) {
          grouped[row.task_id].sub_tasks.push({
            id: row.sub_task_id,
            title: row.sub_task_title,
            hyperlink: row.hyperlink,
          });
        }
      }

      res.json(Object.values(grouped));
    } catch (error) {
      console.error('❌ Error fetching user tasks:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
};

export default UserTaskController;
