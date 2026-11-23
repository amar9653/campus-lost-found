
const express = require("express");
const router = express.Router();

const {
  protect
} = require("../middleware/authMiddleware");

const {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} = require("../controllers/notificationController");

// All notification routes require authentication
router.use(protect);

// Get logged-in user's notifications
router.get("/", getNotifications);

// Mark all notifications as read
router.patch(
  "/read-all",
  markAllNotificationsAsRead
);

// Mark a specific notification as read
router.patch(
  "/:id/read",
  markNotificationAsRead
);

module.exports = router;
