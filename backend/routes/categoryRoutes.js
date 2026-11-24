
const express = require("express");
const router = express.Router();

const {
  getCategories,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require("../controllers/categoryController");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

// PUBLIC ROUTE
// Students can fetch active categories
router.get("/", getCategories);

// ADMIN ROUTES
// Only authenticated admins can manage categories

// Get all categories, including inactive ones
router.get(
  "/admin/all",
  protect,
  authorize("admin"),
  getAllCategories
);

// Create a category
router.post(
  "/",
  protect,
  authorize("admin"),
  createCategory
);

// Update a category
router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateCategory
);

// Delete a category
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteCategory
);

module.exports = router;
