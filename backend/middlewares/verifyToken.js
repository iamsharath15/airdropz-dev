// // middleware/verifyToken.js
// import jwt from "jsonwebtoken";

// export const verifyToken = (req, res, next) => {
//   const token = req.cookies?.token;
//   if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.userId = decoded.userId;
//     next();
//   } catch (err) {
//     return res.status(403).json({ success: false, message: "Invalid token" });
//   }
// };
// middleware/verifyToken.js
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ✅ this includes userId, role, etc.
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
};
