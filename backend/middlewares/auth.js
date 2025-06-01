export const authenticateUser = (req, res, next) => {
  // Set req.userId from JWT/session, e.g.:
  const userIdFromToken = req.user?.id;
  if (!userIdFromToken) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  req.userId = userIdFromToken;
  next();
};
