// middlewares/isAdmin.js
export function isAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "You don't have permission to perform this action." });
  }
  next();
}
