// services/notificationService.js
import pool from '../config/db.js';

export async function createUserNotification({
  user_id,
  type,
  title,
  message,
  target_url = null,
  points_earned = 0,
}) {
  const result = await pool.query(
    `INSERT INTO notifications (user_id, type, title, message, target_url, points_earned)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [user_id, type, title, message, target_url, points_earned]
  );
  const createdNotification = result.rows[0];

  // Delete older notifications after 30
  await pool.query(
    `DELETE FROM notifications
       WHERE id IN (
         SELECT id FROM notifications
         WHERE user_id = $1
         ORDER BY created_at DESC
         OFFSET 30
       )`,
    [user_id]
  );
  return createdNotification;
}
