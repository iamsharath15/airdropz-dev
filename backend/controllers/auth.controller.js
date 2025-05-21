// @desc Register a new user
// @route POST /api/auth/signup
// @access Public
export const signup = async (req, res) => {
  res.send("sigup route")
}

// @desc Log in a user
// @route POST /api/auth/login
// @access Public
export const login = async (req, res) => {
  res.send("login route")
};

// @desc Log out the current user
// @route POST /api/auth/logout
// @access Private (Requires JWT)
export const logout = async (req, res) => {
  res.send("logout route")
};