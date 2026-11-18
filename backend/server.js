
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const reportRoutes = require("./routes/reportRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173"
  })
);

app.use(express.json());

// Handle invalid JSON request bodies
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON request body"
    });
  }

  next(err);
});

// Health check API
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Campus Lost & Found Backend is running!",
    timestamp: new Date().toISOString()
  });
});

// Lost & Found Report APIs
app.use("/api/reports", reportRoutes);

// Handle unknown API routes
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found"
  });
});

// Handle unexpected server errors
app.use((err, req, res, next) => {
  console.error("Server error:", err);

  return res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
