
const mongoose = require("mongoose");
const User = require("../models/User");

// GET ALL STUDENT ACCOUNTS
const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    const formattedUsers = users.map((user) => ({
      ...user,
      id: user._id.toString(),
      status: user.status || "Active"
    }));

    return res.status(200).json({
      success: true,
      data: formattedUsers
    });
  } catch (error) {
    console.error("Get admin users error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch student accounts"
    });
  }
};

// UPDATE STUDENT ACCOUNT STATUS
const updateAdminUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};

    const allowedStatuses = [
      "Active",
      "Suspended",
      "Rejected"
    ];

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid account status"
      });
    }

    // Only student accounts can be modified here
    const user = await User.findOneAndUpdate(
      {
        _id: id,
        role: "user"
      },
      {
        $set: { status }
      },
      {
        new: true,
        runValidators: true
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Student account not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: `Student account ${status.toLowerCase()} successfully`,
      data: {
        ...user.toObject(),
        id: user._id.toString()
      }
    });
  } catch (error) {
    console.error("Update student status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update student status"
    });
  }
};

module.exports = {
  getAdminUsers,
  updateAdminUserStatus
};
