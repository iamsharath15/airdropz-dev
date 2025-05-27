import pool from "../config/db.js";
import dayjs from "dayjs";

export const updateLoginStreak = async (req, res) => {
  const userId = req.userId; // Ensure this is extracted via middleware/auth

  try {
    const result = await pool.query(
      "SELECT * FROM login_streaks WHERE user_id = $1",
      [userId]
    );

    const today = dayjs().format("YYYY-MM-DD");

    if (result.rows.length === 0) {
      // First time login streak
      await pool.query(
        "INSERT INTO login_streaks (user_id, streak_count, last_login_date, total_points) VALUES ($1, $2, $3, $4)",
        [userId, 1, today, 10] // Give 10 points for day 1
      );
      return res.status(201).json({ message: "Streak started", streak: 1, points: 10 });
    }

    const streak = result.rows[0];
    const lastLoginDate = dayjs(streak.last_login_date);
    const diff = dayjs().diff(lastLoginDate, "day");

    let newStreak = streak.streak_count;
    let newPoints = streak.total_points;

    if (diff === 1) {
      newStreak += 1;
      newPoints += 10; // reward 10 points
    } else if (diff > 1) {
      newStreak = 1;
      newPoints += 5; // reward lower points
    } else {
      return res.status(200).json({ message: "Already logged in today", streak: newStreak, points: newPoints });
    }

    await pool.query(
      "UPDATE login_streaks SET streak_count = $1, last_login_date = $2, total_points = $3 WHERE user_id = $4",
      [newStreak, today, newPoints, userId]
    );

    res.status(200).json({ message: "Streak updated", streak: newStreak, points: newPoints });
  } catch (error) {
    console.error("Error updating login streak:", error.message);
    res.status(500).json({ error: "Failed to update login streak" });
  }
};
