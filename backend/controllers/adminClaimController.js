
const mongoose = require("mongoose");
const Claim = require("../models/Claim");

// GET /api/admin/claims
const getAdminClaims = async (req, res) => {
  try {
    const claims = await Claim.find()
      .populate("report", "itemName images")
      .populate("claimant", "name email phone")
      .sort({ createdAt: -1 })
      .lean();

    const formattedClaims = claims.map((claim) => ({
      id: claim._id.toString(),
      reportId: claim.report?._id?.toString() || "",
      itemName: claim.report?.itemName || "Unavailable Item",

      claimantName: claim.claimant?.name || "Unknown Student",
      claimantEmail: claim.claimant?.email || "",
      claimantPhone: claim.claimant?.phone || "",

      studentId: claim.claimant?._id?.toString() || "",
      department: claim.claimant?.department || "",

      submissionDate: claim.createdAt,
      ownershipExplanation: claim.ownershipExplanation,
      identificationDetails: claim.identificationDetails || "",

      evidenceAvailable: Boolean(claim.evidenceUrl),
      evidenceType: claim.evidenceType || "",
      evidenceUrl: claim.evidenceUrl || "",

      status: claim.status,
      adminRemarks: claim.adminRemarks || "",

      history: (claim.history || []).map((step) => ({
        status: step.status,
        date: step.date,
        by: step.by,
        notes: step.notes
      })),

      handover: claim.handover || {}
    }));

    return res.status(200).json({
      success: true,
      count: formattedClaims.length,
      data: formattedClaims
    });
  } catch (error) {
    console.error("Get admin claims error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch claims"
    });
  }
};

// PATCH /api/admin/claims/:id
const updateAdminClaimStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks, handover } = req.body || {};

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid claim ID"
      });
    }

    const allowedTransitions = {
      Pending: ["Under Review", "Approved", "Rejected"],
      "Under Review": ["Approved", "Rejected"],
      Approved: ["Completed"],
      Rejected: [],
      Completed: [],
      Withdrawn: []
    };

    const claim = await Claim.findById(id);

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Claim not found"
      });
    }

    const nextStatuses = allowedTransitions[claim.status] || [];

    if (!nextStatuses.includes(status)) {
      return res.status(409).json({
        success: false,
        message: `Cannot change claim from ${claim.status} to ${status}`
      });
    }

    if (
      status === "Rejected" &&
      (typeof remarks !== "string" || !remarks.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required"
      });
    }

    if (status === "Completed") {
      if (
        !handover ||
        typeof handover.receiver !== "string" ||
        !handover.receiver.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Handover receiver is required"
        });
      }

      claim.handover = {
        receiver: handover.receiver.trim(),
        timestamp: new Date(),
        remarks:
          typeof remarks === "string" ? remarks.trim() : ""
      };
    }

    claim.status = status;
    claim.adminRemarks =
      typeof remarks === "string" ? remarks.trim() : "";

    claim.history.push({
      status,
      date: new Date(),
      by: req.user.name || "Administrator",
      notes: claim.adminRemarks
    });

    await claim.save();

    return res.status(200).json({
      success: true,
      message: `Claim updated to ${status}`,
      data: {
        id: claim._id.toString(),
        status: claim.status,
        adminRemarks: claim.adminRemarks,
        history: claim.history,
        handover: claim.handover
      }
    });
  } catch (error) {
    console.error("Update admin claim error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update claim"
    });
  }
};

module.exports = {
  getAdminClaims,
  updateAdminClaimStatus
};
