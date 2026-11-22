
const mongoose = require("mongoose");
const ItemReport = require("../models/ItemReport");

// GET /api/admin/stats
// Accessible only to authenticated admins
const getAdminStats = async (req, res) => {
  try {
    const [
      totalReports,
      activeReports,
      pendingReports,
      approvedReports,
      rejectedReports,
      returnedItems,
      withdrawnReports
    ] = await Promise.all([
      ItemReport.countDocuments(),
      ItemReport.countDocuments({
        status: "approved",
        isActive: true
      }),
      ItemReport.countDocuments({ status: "pending" }),
      ItemReport.countDocuments({ status: "approved" }),
      ItemReport.countDocuments({ status: "rejected" }),
      ItemReport.countDocuments({ status: "returned" }),
      ItemReport.countDocuments({ status: "withdrawn" })
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalReports,
        activeReports,
        pendingReports,
        approvedReports,
        rejectedReports,
        returnedItems,
        withdrawnReports
      }
    });
  } catch (error) {
    console.error("Admin stats error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin dashboard statistics"
    });
  }
};

// GET /api/admin/reports
// Fetch all reports for admin, regardless of status
const getAdminReports = async (req, res) => {
  try {
    const reports = await ItemReport.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    console.error("Admin reports error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin reports"
    });
  }
};

// PATCH /api/admin/reports/:id/status
// Update report status (admin only)
const updateAdminReportStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (
      !req.body ||
      typeof req.body !== "object" ||
      Array.isArray(req.body)
    ) {
      return res.status(400).json({
        success: false,
        message: "A valid JSON object is required"
      });
    }

    const { status, reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report ID"
      });
    }

    const report = await ItemReport.findById(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found"
      });
    }

    // Allowed status transitions
    const allowedTransitions = {
      pending: ["approved", "rejected", "archived"],
      approved: ["archived"],
      rejected: [],
      archived: [],
      withdrawn: [],
      matched: [],
      returned: []
    };

    const validNextStatuses =
      allowedTransitions[report.status] || [];

    if (!validNextStatuses.includes(status)) {
      return res.status(409).json({
        success: false,
        message:
          `Cannot change report status from ${report.status} to ${status}`
      });
    }

    if (
      status === "rejected" &&
      (typeof reason !== "string" || !reason.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required"
      });
    }

    report.status = status;

    if (status === "rejected") {
      report.rejectionReason = reason.trim();
    } else {
      report.rejectionReason = null;
    }

    // Only approved reports are publicly visible
    report.isActive = status === "approved";

    await report.save();
    await report.populate("user", "name email");

    return res.status(200).json({
      success: true,
      message: `Report status updated to ${status}`,
      data: report
    });
  } catch (error) {
    console.error("Admin report status update error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update report status"
    });
  }
};

module.exports = {
  getAdminStats,
  getAdminReports,
  updateAdminReportStatus
};
