
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

// Upload directory
const uploadDir = path.join(__dirname, "../uploads");

// Create uploads folder if it doesn't exist
fs.mkdirSync(uploadDir, { recursive: true });

// Allowed image formats
const allowedTypes = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp"
};

// Configure file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName = crypto.randomUUID();
    const extension = allowedTypes[file.mimetype];

    cb(null, uniqueName + (extension || ""));
  }
});

// Validate uploaded file
const fileFilter = (req, file, cb) => {
  if (!allowedTypes[file.mimetype]) {
    return cb(
      new Error("Only JPG, PNG and WEBP images are allowed"),
      false
    );
  }

  cb(null, true);
};

// Configure Multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1
  }
});

module.exports = upload;
