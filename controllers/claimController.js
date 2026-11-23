
const mongoose = require("mongoose");
const Claim = require("../models/Claim");
const ItemReport = require("../models/ItemReport");

// Student: Submit ownership claim
const createClaim = async (req, res) => {
  try {
    const {
      reportId,
      ownershipExplanation,
      identificationDetails,
      evidenceType,
      evidenceUrl
    } = req.body || {};

    if (!mongoose.isValidObjectId(reportId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report ID"
      });
    }

    if (
      typeof ownershipExplanation !== "string" ||
      ownershipExplanation.trim().length < 10 ||
      ownershipExplanation.trim().length > 2000
    ) {
      return res.status(400).json({
        success: false,
        message: "Ownership explanation must contain 10 to 2000 characters"
      });
    }

    const report = await ItemReport.findById(reportId);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Item report not found"
      });
    }

    if (report.type !== "found" || report.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Only approved found items can be claimed"
      });
    }

    if (String(report.user) === String(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: "You cannot claim your own reported item"
      });
    }

    const existingClaim = await Claim.findOne({
      report: report._id,
      claimant: req.user._id,
      status: {
        $in: ["Pending", "Under Review", "Approved", "Completed"]
      }
    });

    if (existingClaim) {
      return res.status(409).json({
        success: false,
        message: "You already have an active claim for this item"
      });
    }

    const claim = await Claim.create({
      report: report._id,
      claimant: req.user._id,
      ownershipExplanation: ownershipExplanation.trim(),
      identificationDetails:
        typeof identificationDetails === "string"
          ? identificationDetails.trim()
          : "",
      evidenceType:
        typeof evidenceType === "string"
          ? evidenceType.trim()
          : "",
      evidenceUrl:
        typeof evidenceUrl === "string"
          ? evidenceUrl.trim()
          : "",
      status: "Pending",
      history: [
        {
          status: "Pending",
          date: new Date(),
          by: req.user.name || "Student",
          notes: "Ownership claim submitted for verification"
        }
      ]
    });

    return res.status(201).json({
      success: true,
      message: "Claim submitted successfully",
      data: {
        id: claim._id.toString(),
        status: claim.status
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You already have an active claim for this item"
      });
    }

    console.error("Create claim error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit claim"
    });
  }
};

// Student: View own claims
const getMyClaims = async (req, res) => {
  try {
    const claims = await Claim.find({
      claimant: req.user._id
    })
      .populate("report", "itemName images")
      .sort({ createdAt: -1 })
      .lean();

    const formattedClaims = claims.map(claim => ({
      id: claim._id.toString(),
      reportId: claim.report?._id?.toString() || "",
      itemName: claim.report?.itemName || "Unavailable Item",
      image: claim.report?.images?.[0] || "",
      status: claim.status,
      submissionDate: claim.createdAt,
      ownershipExplanation: claim.ownershipExplanation,
      adminRemarks: claim.adminRemarks || ""
    }));

    return res.status(200).json({
      success: true,
      data: formattedClaims
    });
  } catch (error) {
    console.error("Get my claims error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your claims"
    });
  }
};

module.exports = {
  createClaim,
  getMyClaims
};
