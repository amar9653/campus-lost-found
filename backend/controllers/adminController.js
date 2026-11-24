
const mongoose = require("mongoose");
const ItemReport = require("../models/ItemReport");
const Notification = require("../models/Notification");

// GET /api/admin/stats
const getAdminStats = async (req, res) => {
  try {
    const [
      totalReports,
      activeReports,
      pendingReports,
      approvedReports,
      rejectedReports,
      returnedItems,
      withdrawnReports,
      archivedReports,
      matchedReports,
      lostReports,
      foundReports
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
      ItemReport.countDocuments({ status: "withdrawn" }),
      ItemReport.countDocuments({ status: "archived" }),
      ItemReport.countDocuments({ status: "matched" }),
      ItemReport.countDocuments({ type: "lost" }),
      ItemReport.countDocuments({ type: "found" })
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
        withdrawnReports,
        archivedReports,
        matchedReports,
        lostReports,
        foundReports
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

    report.isActive = status === "approved";

    await report.save();
    await report.populate("user", "name email");

    // Create notification for the report owner
    const notificationDetails = {
      approved: {
        title: "Report Approved",
        message:
          `Your ${report.type} item report "${report.itemName}" ` +
          "has been approved by the administrator.",
        type: "success"
      },
      rejected: {
        title: "Report Rejected",
        message:
          `Your ${report.type} item report "${report.itemName}" ` +
          `was rejected. Reason: ${report.rejectionReason}`,
        type: "error"
      },
      archived: {
        title: "Report Archived",
        message:
          `Your ${report.type} item report "${report.itemName}" ` +
          "has been archived by the administrator.",
        type: "info"
      }
    };

    const details = notificationDetails[status];

    if (details && report.user?._id) {
      try {
        await Notification.create({
          recipient: report.user._id,
          title: details.title,
          message: details.message,
          type: details.type,
          relatedReport: report._id
        });
      } catch (notificationError) {
        console.error(
          "Failed to create report notification:",
          notificationError
        );
      }
    }

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
