
const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");

const {
  getAdminStats,
  getAdminReports,
  updateAdminReportStatus
} = require("../controllers/adminController");

// All routes below require admin authentication
router.use(protect, authorize("admin"));

router.get("/stats", getAdminStats);
router.get("/reports", getAdminReports);

// Admin-only report status update
router.patch("/reports/:id/status", updateAdminReportStatus);

module.exports = router;
