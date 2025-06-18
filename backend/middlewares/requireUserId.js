export function requireUserId(req, res, next) {
  const user_id = req.user?.userId;

  if (!user_id) {
    return res.status(400).json({
      success: false,
      message: 'User ID is required.',
    });
  }

  req.user_id = user_id;
  next();
}
