import pool from '../config/db.js';

class DailyLoginController {
  static async handleDailyLogin(req, res) {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    // Use mockDate from query param for testing, fallback to today
    const today = req.query.mockDate || new Date().toISOString().split('T')[0];

    try {
      // 1. Check if already logged in today
      const { rows: existingLogin } = await pool.query(
        `SELECT * FROM user_logins WHERE user_id = $1 AND login_date = $2`,
        [userId, today]
      );

      if (existingLogin.length > 0) {
        // User already logged in today, return existing streak count and 0 points for today
        return res.status(200).json({
          message: 'You have already logged in today.',
          streakCount: existingLogin[0].streak_count,
          todayPoints: 0,
        });
      }

      // 2. Get the most recent previous login (not today)
      const { rows: lastLoginRows } = await pool.query(
        `SELECT * FROM user_logins WHERE user_id = $1 ORDER BY login_date DESC LIMIT 1`,
        [userId]
      );

      let streakCount = 1; // default streak if no previous login or gap >1 day

      if (lastLoginRows.length > 0) {
        const lastLoginDate = new Date(lastLoginRows[0].login_date);
        const currentDate = new Date(today);
        const diffTime = currentDate.getTime() - lastLoginDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          // Last login was yesterday → continue streak
          streakCount = lastLoginRows[0].streak_count + 1;
        }
        // else if diffDays > 1 streak resets to 1
      }

      // 3. Insert today's login with streak count, avoid duplicates by ON CONFLICT DO NOTHING
      await pool.query(
        `INSERT INTO user_logins (user_id, login_date, streak_count)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, login_date) DO NOTHING`,
        [userId, today, streakCount]
      );

      // 4. Update leaderboard points (+2 for daily login)
      await pool.query(
        `UPDATE leaderboard SET points = points + 2 WHERE user_id = $1`,
        [userId]
      );

      await pool.query(
        `UPDATE users 
   SET 
     daily_login_streak_count = $1,
     last_login = NOW(),
     airdrops_earned = airdrops_earned + 2,
     airdrops_remaining = airdrops_remaining + 2
   WHERE id = $2`,
        [streakCount, userId]
      );

      return res.status(200).json({
        message: streakCount > 1 ? 'Streak continued!' : 'Streak started.',
        streakCount,
        todayPoints: 2,
      });
    } catch (error) {
      console.error('❌ Daily login error:', error);
      return res.status(500).json({
        message: 'Something went wrong. Please try again later.',
      });
    }
  }

  static async getLoginDates(req, res) {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    try {
      const { rows } = await pool.query(
        `SELECT login_date FROM user_logins WHERE user_id = $1 ORDER BY login_date ASC`,
        [userId]
      );

      const loginDates = rows.map(
        (r) => r.login_date.toISOString().split('T')[0]
      );

      return res.status(200).json({ loginDates });
    } catch (err) {
      console.error('❌ Error fetching login dates:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  }
}

export default DailyLoginController;
