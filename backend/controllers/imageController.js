
const fs = require("fs/promises");

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
  // Report ownership already verified by middleware
  const report = req.report;

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Image file is required"
    });
  }

  // Prevent uploads to withdrawn or inactive reports
  if (report.status === "withdrawn" || report.isActive === false) {
    await deleteUploadedFile(req.file.path);

    return res.status(409).json({
      success: false,
      message: "Cannot upload images to a withdrawn or inactive report"
    });
  }

  try {
    const filename = req.file.filename;
    const imageUrl = `/uploads/${filename}`;

    // Link image to report
    report.images.push(imageUrl);
    await report.save();

    return res.status(200).json({
      success: true,
      message: "Image uploaded and linked to report successfully",
      data: {
        reportId: report._id,
        imageUrl,
        images: report.images
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
