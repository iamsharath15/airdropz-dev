import pool from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { createUserNotification } from '../services/notificationService.js';

export class NotificationController {
  async getUserNotifications(req, res) {
    const user_id = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.per_page) || 10;
    const offset = (page - 1) * perPage;

    try {
      const countResult = await pool.query(
        `SELECT COUNT(*) FROM notifications WHERE user_id = $1`,
        [user_id]
      );
      const total = parseInt(countResult.rows[0].count, 10);

      const result = await pool.query(
        `SELECT * FROM notifications
         WHERE user_id = $1
         ORDER BY is_read ASC, created_at DESC
         LIMIT $2 OFFSET $3`,
        [user_id, perPage, offset]
      );

      const notifications = result.rows;
      return sendSuccess(
        res,
        notifications,
        notifications.length > 0
          ? 'Notifications fetched successfully.'
          : 'No notifications found.',
        200,
        {
          meta: {
            page,
            per_page: perPage,
            total,
          },
        }
      );
    } catch (error) {
      return sendError(res, 'Error fetching notifications.', 500, error);
    }
  }

  async createNotification(req, res) {
    const user_id = req.user.userId;
    const { type, title, message, target_url, points_earned = 0 } = req.body;
    if (!type || !title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: user_id, type, title, or message.',
      });
    }
    try {
        const createNotification = await createUserNotification({
      user_id,
      type,
      title,
      message,
      target_url,
      points_earned,
    });

      return sendSuccess(
        res,
        createNotification,
        'Notification created successfully.',
        201
      );
    } catch (error) {
      return sendError(res, 'Error creating notification', 500, error);
    }
  }

  async markAsRead(req, res) {
    const user_id = req.user.userId;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Notification ID is required.',
      });
    }
    try {
      const result = await pool.query(
        `UPDATE notifications
         SET is_read = true, updated_at = CURRENT_TIMESTAMP
         WHERE id = $1 AND user_id = $2 
         RETURNING *`,
        [id, user_id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Notification not found.',
        });
      }

      const markAsReadNotification = result.rows[0];
      return sendSuccess(
        res,
        markAsReadNotification,
        'Notification marked as read.',
        200
      );
    } catch (error) {
      return sendError(res, 'Error marking notification as read', 500, error);
    }
  }
}
