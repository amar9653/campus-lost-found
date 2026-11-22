
const User = require("../models/User");
const { generateToken } = require("../utils/jwt");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// REGISTER USER
const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body || {};

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid name, email, and password are required"
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!emailPattern.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long"
      });
    }

    if (
      phone !== undefined &&
      phone !== null &&
      typeof phone !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be a string"
      });
    }

    const userExists = await User.findOne({
      email: normalizedEmail
    });

    if (userExists) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists"
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,

      // Public registration can only create student accounts
      role: "user",

      phone: typeof phone === "string" ? phone.trim() : ""
    });

    const token = generateToken(user._id, user.role);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        token
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists"
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Invalid registration details"
      });
    }

    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during registration"
    });
  }
};

// LOGIN USER
const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        token
      }
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during login"
    });
  }
};

// GET CURRENT USER PROFILE
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error fetching profile"
    });
  }
};

module.exports = {
  register,
  login,
  getMe
};
