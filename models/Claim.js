
const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema(
  {
    report: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ItemReport",
      required: true
    },

    claimant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    ownershipExplanation: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 2000
    },

    identificationDetails: {
      type: String,
      trim: true,
      default: ""
    },

    evidenceType: {
      type: String,
      trim: true,
      default: ""
    },

    evidenceUrl: {
      type: String,
      trim: true,
      default: ""
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Under Review",
        "Approved",
        "Rejected",
        "Completed",
        "Withdrawn"
      ],
      default: "Pending"
    },

    adminRemarks: {
      type: String,
      trim: true,
      default: ""
    },

    history: [
      {
        status: {
          type: String,
          required: true
        },
        date: {
          type: Date,
          default: Date.now
        },
        by: {
          type: String,
          required: true
        },
        notes: {
          type: String,
          default: ""
        }
      }
    ],

    handover: {
      receiver: {
        type: String,
        default: ""
      },
      timestamp: {
        type: Date,
        default: null
      },
      remarks: {
        type: String,
        default: ""
      }
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate active claims by the same student
// for the same found item.
claimSchema.index(
  { report: 1, claimant: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: {
        $in: [
          "Pending",
          "Under Review",
          "Approved",
          "Completed"
        ]
      }
    }
  }
);

// Improve admin claim listing performance
claimSchema.index({
  status: 1,
  createdAt: -1
});

module.exports = mongoose.model("Claim", claimSchema);
