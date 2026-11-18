
const fs = require("fs/promises");

// Upload image controller
const uploadReportImage = async (req, res) => {
  // This controller must only be used after:
  // 1. JWT authentication
  // 2. Report existence verification
  // 3. Report ownership/permission verification
  // 4. Image signature validation

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Image file is required"
    });
  }

  // Until database integration is ready,
  // remove the uploaded file to avoid orphan files.
  try {
    await fs.unlink(req.file.path);
  } catch (error) {
    console.error("Failed to clean up uploaded file:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to clean up temporary upload"
    });
  }

  return res.status(501).json({
    success: false,
    message: "Image received, but report image storage is not implemented yet"
  });
};

module.exports = {
  uploadReportImage
};
