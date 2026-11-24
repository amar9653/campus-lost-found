
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    message: {
      type: String,
      required: true,
      trim: true
    },

    type: {
      type: String,
      enum: [
        "info",
        "success",
        "warning",
        "error"
      ],
      default: "info"
    },

    isRead: {
      type: Boolean,
      default: false
    },

    relatedReport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ItemReport",
      default: null
    },

    relatedClaim: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Claim",
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Faster notification listing
notificationSchema.index({
  recipient: 1,
  createdAt: -1
});

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);
