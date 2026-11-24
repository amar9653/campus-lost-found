
const User = require("../models/User");
const { verifyToken } = require("../utils/jwt");

// Protect routes - requires valid JWT
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No authentication token provided."
    });
  }

  let decoded;

  try {
    decoded = verifyToken(token);
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token."
    });
  }

  try {
    // Fetch current user from MongoDB
    const user = await User.findById(decoded.id)
      .select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. User no longer exists."
      });
    }

    // Block suspended accounts
    if (user.status === "Suspended") {
      return res.status(403).json({
        success: false,
        message:
          "Your account has been suspended. Contact the administrator."
      });
    }

    // Block rejected accounts
    if (user.status === "Rejected") {
      return res.status(403).json({
        success: false,
        message:
          "Your account has been rejected. Contact the administrator."
      });
    }

    // Allow active users and legacy users without a status
    req.user = user;
    return next();

  } catch (error) {
    console.error("Authentication middleware error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during authentication."
    });
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action."
      });
    }

    next();
  };
};

module.exports = {
  protect,
  authorize
};
