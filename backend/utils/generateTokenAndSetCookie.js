// import jwt from "jsonwebtoken";

// /**
//  * Generate JWT token and set as HTTP-only cookie
//  */
// export const generateTokenAndSetCookie = (res, userId, expiresIn = "7d") => {
//   const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
//     expiresIn,
//   });

//   const cookieOptions = {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict",
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//   };

//   res.cookie("token", token, cookieOptions);
//   return token;
// };

// /**
//  * Middleware to authenticate user via JWT in cookie
//  */
// export const authenticateUser = (req, res, next) => {
//   const token = req.cookies?.token;

//   if (!token) {
//     return res.status(401).json({ success: false, message: "Unauthorized" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     return res.status(403).json({ success: false, message: "Invalid token" });
//   }
// };
import jwt from "jsonwebtoken";

/**
 * Generate JWT token and set as HTTP-only cookie
 */
export const generateTokenAndSetCookie = (res, user, expiresIn = "7d") => {
  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role, // ✅ Include role for isAdmin checks
    },
    process.env.JWT_SECRET,
    { expiresIn }
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res.cookie("token", token, cookieOptions);
  return token;
};

/**
 * Middleware to authenticate user via JWT in cookie
 */
export const authenticateUser = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ✅ contains userId, role, email
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
};
