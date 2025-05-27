import jwt from "jsonwebtoken";

/**
 * Generate JWT token for a user and set it as an HTTP-only cookie in the response.
 * @param {object} res - Express response object
 * @param {string|number} userId - The user's unique ID
 * @param {string} [expiresIn='7d'] - Token expiration duration (optional)
 * @returns {string} The generated JWT token
 */

export const generateTokenAndSetCookie = (res, userId, expiresIn = "7d") => {
  
  // Create JWT token with userId as payload
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn,
  });

  // Log token for debugging (remove in production)
  console.log(token);

  // Set cookie options
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // use secure cookie in prod only
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  };

  // Set cookie on response
  res.cookie("token", token, cookieOptions);
  
  return token;
  
}