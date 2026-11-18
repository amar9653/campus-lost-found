
const express = require("express");
const router = express.Router();

const {
  createReport,
  getReports,
  getReportById,
  updateReport,
  withdrawReport
} = require("../controllers/reportController");

// Public report routes
router.get("/", getReports);
router.get("/:id", getReportById);

// Create report
// TODO: Add JWT authentication before production
router.post("/", createReport);

// Update report
// TODO: Add authentication and ownership checks
router.patch("/:id", updateReport);

// Withdraw report
// TODO: Add authentication and ownership checks
router.patch("/:id/withdraw", withdrawReport);

// Image upload route
// Disabled until authentication, report ownership,
// image signature validation and DB integration are ready.
router.post("/:id/images", (req, res) => {
  return res.status(503).json({
    success: false,
    message: "Image upload is temporarily unavailable"
  });
});

module.exports = router;
