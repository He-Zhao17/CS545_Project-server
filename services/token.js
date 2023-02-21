require("dotenv").config();
const TOKEN_KEY = process.env.TOKEN_KEY;

const jwt = require("jsonwebtoken");

/**
 *
 * @param {String} userId
 * @param {String} email
 * @param {jwt.SignOptions} options
 * @return {String} //JWT Token string
 */
const generateToken = (userId, email, options = {}, role = "user") => {
  const token = jwt.sign(
    {
      userId,
      email,
      role,
    },
    TOKEN_KEY,
    options
  );

  return token;
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const validateToken = (req, res, next) => {
  const token = req.headers["x-access-token"] || null;

  if (!token)
    return res.status(403).json({
      status: 403,
      message: "A token is required to access this data",
    });

  try {
    const decoded = jwt.verify(token, TOKEN_KEY);
    req.user = decoded;
  } catch (error) {
    return res.status(401).json({
      status: 401,
      message: "Invalid token, please try again.",
    });
  }

  return next();
};

module.exports = {
  generateToken,
  validateToken,
};
