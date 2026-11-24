
const express = require("express");
const router = express.Router();

const {
  createClaim,
  getMyClaims
} = require("../controllers/claimController");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

// All claim routes require student authentication
router.use(protect, authorize("user"));

// Student: View own claims
router.get("/mine", getMyClaims);

// Student: Submit ownership claim
router.post("/", createClaim);

module.exports = router;
