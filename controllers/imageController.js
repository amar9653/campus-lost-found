
const fs = require("fs/promises");

const ALLOWED_UPLOAD_STATUSES = ["pending", "approved"];

// Delete uploaded file safely
const deleteUploadedFile = async (filePath) => {
  if (!filePath) return;

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Image cleanup failed:", error);
    }
  }
};

// Upload image controller
const uploadReportImage = async (req, res) => {
  // Ownership already verified by middleware
  const report = req.report;

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Image file is required"
    });
  }

  // Allow pending reports and active approved reports only
  if (
    !ALLOWED_UPLOAD_STATUSES.includes(report.status) ||
    (report.status === "approved" && report.isActive !== true)
  ) {
    await deleteUploadedFile(req.file.path);

    return res.status(409).json({
      success: false,
      message:
        "Images can only be uploaded to pending or active approved reports"
    });
  }

  try {
    const filename = req.file.filename;
    const imageUrl = `/uploads/${filename}`;

    // Link image to report
    report.images.push(imageUrl);

    // New images must be reviewed by admin
    report.status = "pending";
    report.isActive = false;
    report.rejectionReason = null;

    await report.save();

    return res.status(200).json({
      success: true,
      message:
        "Image uploaded successfully. Report is pending admin approval.",
      data: {
        reportId: report._id,
        imageUrl,
        images: report.images,
        status: report.status
      }
    });
  } catch (error) {
    await deleteUploadedFile(req.file?.path);

    console.error("Image upload failed:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save image to report"
    });
  }
};

module.exports = {
  uploadReportImage
};
