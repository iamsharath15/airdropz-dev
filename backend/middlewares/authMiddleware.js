// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const protect = async (req, res, next) => {
  // let token = req.headers.authorization?.split(" ")[1];
  const token = req.cookies?.token;

  if (!token) return res.status(401).json({ message: "Not authorized, token missing" });


  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [decoded.userId]);

    if (!result.rows.length) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = result.rows[0];
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token failed" });
  }
};

