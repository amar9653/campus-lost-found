const fs = require("fs/promises");
const path = require("path");

// Upload image controller
const uploadReportImage = async (req, res) => {
  // Report is already validated and ownership verified via verifyReportOwnership middleware
  const report = req.report;

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Image file is required"
    });
  }

  try {
    const filename = req.file.filename;
    // Add image to report's image list
    report.images.push(`/uploads/${filename}`);
    await report.save();

    return res.status(200).json({
      success: true,
      message: "Image uploaded and linked to report successfully",
      data: {
        reportId: report._id,
        imageUrl: `/uploads/${filename}`,
        images: report.images
      }
    });
  } catch (error) {
    if (req.file?.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (err) {
        console.error("Cleanup error:", err);
      }
    }
    return res.status(500).json({
      success: false,
      message: "Failed to save image to report",
      error: error.message
    });
  }
};

module.exports = {
  uploadReportImage
};
