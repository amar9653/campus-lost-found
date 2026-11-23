const ItemReport = require("../models/ItemReport");

/**
 * Middleware to verify report ownership:
 * - Checks if the report exists.
 * - Confirms that req.user._id matches report.user (or req.user.role === 'admin').
 * - Attaches report to req.report for subsequent controllers to use.
 */
const verifyReportOwnership = async (req, res, next) => {
  const { id } = req.params;

  // Validate MongoDB ObjectId format
  const objectIdPattern = /^[a-fA-F0-9]{24}$/;
  if (!objectIdPattern.test(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid report ID format"
    });
  }

  try {
    const report = await ItemReport.findById(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found"
      });
    }

    // Admins can manage any report; standard users must own the report
    const isOwner = report.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access forbidden: You do not own this report"
      });
    }

    req.report = report;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error verifying report ownership",
      error: error.message
    });
  }
};

module.exports = {
  verifyReportOwnership
};
