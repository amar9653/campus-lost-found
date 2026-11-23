
const fs = require("fs/promises");

// Identify image format from actual file bytes
const detectImageType = (buffer) => {
  // JPEG signature
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return "image/jpeg";
  }

  // PNG signature
  const pngSignature = Buffer.from([
    0x89, 0x50, 0x4e, 0x47,
    0x0d, 0x0a, 0x1a, 0x0a
  ]);

  if (
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(pngSignature)
  ) {
    return "image/png";
  }

  // WEBP signature
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }

  return null;
};

// Validate uploaded image
const validateImage = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Image file is required"
    });
  }

  try {
    // Read the uploaded file
    const buffer = await fs.readFile(req.file.path);

    // Detect actual image format
    const detectedType = detectImageType(buffer);

    // Compare actual type with declared MIME type
    if (!detectedType || detectedType !== req.file.mimetype) {
      await fs.unlink(req.file.path);

      return res.status(400).json({
        success: false,
        message: "Invalid image file. Only genuine JPG, PNG and WEBP files are allowed"
      });
    }

    // Image signature verified
    next();
  } catch (error) {
    // Clean up temporary file if validation fails
    if (req.file?.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (cleanupError) {
        console.error("Image cleanup failed:", cleanupError);
      }
    }

    console.error("Image validation failed:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to validate uploaded image"
    });
  }
};

module.exports = validateImage;
