
const mongoose = require("mongoose");

const itemReportSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, "Report type is required"],
      enum: {
        values: ["lost", "found"],
        message: "Report type must be 'lost' or 'found'"
      }
    },

    itemName: {
      type: String,
      required: [true, "Item name is required"],
      trim: true
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true
    },

    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true
    },

    eventDate: {
      type: String,
      required: [true, "Event date is required"]
    },

    contact: {
      type: String,
      trim: true,
      default: null
    },

    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "matched",
        "returned",
        "archived",
        "withdrawn",
        "rejected"
      ],
      default: "pending"
    },

    rejectionReason: {
      type: String,
      trim: true,
      default: null
    },

    isActive: {
      type: Boolean,
      default: false
    },

    images: [
      {
        type: String
      }
    ],

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Report must belong to a user"]
    }
  },
  {
    timestamps: true
  }
);

// Indexes for searching and filtering
itemReportSchema.index({
  itemName: "text",
  description: "text"
});

itemReportSchema.index({
  type: 1,
  status: 1,
  isActive: 1
});

itemReportSchema.index({
  category: 1,
  location: 1
});

module.exports = mongoose.model("ItemReport", itemReportSchema);
