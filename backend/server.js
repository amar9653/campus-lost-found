
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
const seedDatabase = require("./config/seed");

const reportRoutes = require("./routes/reportRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const claimRoutes = require("./routes/claimRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost"
  })
);

app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// Handle invalid JSON
app.use((err, req, res, next) => {
  if (
    err instanceof SyntaxError &&
    err.status === 400 &&
    "body" in err
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON request body"
    });
  }

  next(err);
});

// Health check
app.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Campus Lost & Found Backend is running!",
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/claims", claimRoutes);
app.use("/api/notifications", notificationRoutes);

// Unknown API endpoint
app.use("/api", (req, res) => {
  return res.status(404).json({
    success: false,
    message: "API endpoint not found"
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);

  return res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

// Start server: connect DB → seed admin & categories → listen
if (process.env.NODE_ENV !== "test") {
  const start = async () => {
    await connectDB();
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`Backend running at http://localhost:${PORT}`);
    });
  };

  start();
}

module.exports = app;
