
const express = require("express");
const router = express.Router();

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

const {
  getAdminStats,
  getAdminReports,
  updateAdminReportStatus
} = require("../controllers/adminController");

const {
  getAdminUsers,
  updateAdminUserStatus
} = require("../controllers/adminUserController");

const {
  getAdminClaims,
  updateAdminClaimStatus
} = require("../controllers/adminClaimController");

// All routes require admin authentication
router.use(protect, authorize("admin"));

// Dashboard statistics
router.get("/stats", getAdminStats);

// Report management
router.get("/reports", getAdminReports);

router.patch(
  "/reports/:id/status",
  updateAdminReportStatus
);

// User management
router.get("/users", getAdminUsers);

router.patch(
  "/users/:id/status",
  updateAdminUserStatus
);

// Claims management
router.get("/claims", getAdminClaims);

router.patch(
  "/claims/:id",
  updateAdminClaimStatus
);

module.exports = router;
