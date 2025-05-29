import pool from '../config/db.js';

class DailyLoginController {
  static async handleDailyLogin(req, res) {
    const userId = req.user?.id; // Assumes authentication middleware sets req.user

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const today = new Date().toISOString().split('T')[0];

    try {
      const result = await pool.query(
        `SELECT * FROM daily_login_streaks WHERE user_id = $1`,
        [userId]
      );

      // const leaderboardInit = await pool.query(
      //   `INSERT INTO leaderboard (user_id, points) VALUES ($1, 0)
      //    ON CONFLICT (user_id) DO NOTHING`,
      //   [userId]
      // );

      if (result.rows.length === 0) {
        // First login
        await pool.query(
          `INSERT INTO daily_login_streaks (user_id, streak_count, last_login_date, points)
           VALUES ($1, 1, $2, 2)`,
          [userId, today]
        );

        await pool.query(
          `UPDATE leaderboard SET points = points + 2 WHERE user_id = $1`,
          [userId]
        );

        return res.status(200).json({
          message: 'Daily login streak started.',
          streakCount: 1,
          todayPoints: 2,
        });
      }

      const streak = result.rows[0];
      const lastLoginDate = new Date(streak.last_login_date);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const isSameDay = (d1, d2) =>
        d1.toISOString().split('T')[0] === d2.toISOString().split('T')[0];

      if (isSameDay(lastLoginDate, new Date(today))) {
        return res.status(200).json({
          message: 'Already logged in today.',
          streakCount: streak.streak_count,
          todayPoints: 0,
        });
      }

      if (isSameDay(lastLoginDate, yesterday)) {
        // Continue streak
        const newCount = streak.streak_count + 1;
        const newPoints = streak.points + 2;

        await pool.query(
          `UPDATE daily_login_streaks
           SET streak_count = $1, last_login_date = $2, points = $3
           WHERE user_id = $4`,
          [newCount, today, newPoints, userId]
        );

        await pool.query(
          `UPDATE leaderboard SET points = points + 2 WHERE user_id = $1`,
          [userId]
        );

        return res.status(200).json({
          message: 'Streak continued!',
          streakCount: newCount,
          todayPoints: 2,
        });
      } else {
        // Missed a day – reset streak
        await pool.query(
          `UPDATE daily_login_streaks
           SET streak_count = 1, last_login_date = $1, points = points + 2
           WHERE user_id = $2`,
          [today, userId]
        );

        await pool.query(
          `UPDATE leaderboard SET points = points + 2 WHERE user_id = $1`,
          [userId]
        );

        return res.status(200).json({
          message: 'Streak reset. Back to day 1.',
          streakCount: 1,
          todayPoints: 2,
        });
      }
    } catch (err) {
      console.error('Daily login error:', err);
      res.status(500).json({
        message: 'Something went wrong. Please try again later.',
      });
    }
  }
}

module.exports = DailyLoginController;
