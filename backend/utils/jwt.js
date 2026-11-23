const jwt = require("jsonwebtoken");

const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || "default_jwt_secret_dev_key",
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d"
    }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || "default_jwt_secret_dev_key");
};

module.exports = {
  generateToken,
  verifyToken
};
