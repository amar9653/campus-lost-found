
const multer = require("multer");

// Handle Multer upload errors
const uploadErrorHandler = (error, req, res, next) => {
  if (!error) {
    return next();
  }

  // File size exceeds 5 MB
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        success: false,
        message: "Image size must not exceed 5 MB"
      });
    }

    // Unexpected file field or too many files
    if (
      error.code === "LIMIT_UNEXPECTED_FILE" ||
      error.code === "LIMIT_FILE_COUNT"
    ) {
      return res.status(400).json({
        success: false,
        message: "Upload exactly one image using the 'image' field"
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid image upload request"
    });
  }

  // Handle invalid file types
  if (
    error.message === "Only JPG, PNG and WEBP images are allowed"
  ) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  // Handle unexpected errors
  console.error("Upload error:", error);

  return res.status(500).json({
    success: false,
    message: "Image upload failed"
  });
};

module.exports = uploadErrorHandler;
