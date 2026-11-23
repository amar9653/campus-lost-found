const express = require("express");
const router = express.Router();

const {
  createReport,
  getReports,
  getMyReports,
  getReportById,
  updateReport,
  withdrawReport
} = require("../controllers/reportController");
const { uploadReportImage } = require("../controllers/imageController");

const { protect } = require("../middleware/authMiddleware");
const { verifyReportOwnership } = require("../middleware/ownershipMiddleware");
const upload = require("../middleware/uploadMiddleware");
const validateImage = require("../middleware/validateImage");
const uploadErrorHandler = require("../middleware/uploadErrorHandler");

// Public routes
router.get("/", getReports);

// Specific paths must precede /:id, otherwise "user" is interpreted as an ID.
router.get("/user/mine", protect, getMyReports);

// Protected routes (Requires JWT authentication)
router.post("/", protect, createReport);
router.get("/:id", getReportById);

// Protected routes with Ownership Verification
router.patch("/:id", protect, verifyReportOwnership, updateReport);
router.patch("/:id/withdraw", protect, verifyReportOwnership, withdrawReport);

// Upload image with authentication and ownership check
router.post(
  "/:id/images",
  protect,
  verifyReportOwnership,
  upload.single("image"),
  uploadErrorHandler,
  validateImage,
  uploadReportImage
);

module.exports = router;
