
const mongoose = require("mongoose");
const Category = require("../models/Category");
const ItemReport = require("../models/ItemReport");

// Escape special regex characters
const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Find reports using a category name
const categoryReportFilter = (name) => ({
  category: {
    $regex: `^${escapeRegex(name)}$`,
    $options: "i"
  }
});

// GET ACTIVE CATEGORIES
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      isActive: true
    }).sort({ name: 1 });

    return res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error("Get categories error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories"
    });
  }
};

// GET ALL CATEGORIES FOR ADMIN
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({
      name: 1
    });

    return res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error("Get all categories error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories"
    });
  }
};

// CREATE CATEGORY
const createCategory = async (req, res) => {
  try {
    const { name, description = "" } = req.body || {};

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required"
      });
    }

    if (typeof description !== "string") {
      return res.status(400).json({
        success: false,
        message: "Description must be text"
      });
    }

    const cleanName = name.trim();

    const existingCategory = await Category.findOne({
      name: {
        $regex: `^${escapeRegex(cleanName)}$`,
        $options: "i"
      }
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category already exists"
      });
    }

    const category = await Category.create({
      name: cleanName,
      description: description.trim()
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category
    });
  } catch (error) {
    console.error("Create category error:", error);

    return res.status(error.code === 11000 ? 409 : 500).json({
      success: false,
      message:
        error.code === 11000
          ? "Category already exists"
          : "Failed to create category"
    });
  }
};

// UPDATE CATEGORY
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID"
      });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    const { name, description, isActive } = req.body || {};

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Valid category name is required"
        });
      }

      const newName = name.trim();

      const duplicate = await Category.findOne({
        _id: { $ne: category._id },
        name: {
          $regex: `^${escapeRegex(newName)}$`,
          $options: "i"
        }
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "Another category with this name already exists"
        });
      }

      // Prevent unsafe renaming when reports exist.
      // This avoids partial updates across collections.
      if (newName !== category.name) {
        const reportCount = await ItemReport.countDocuments(
          categoryReportFilter(category.name)
        );

        if (reportCount > 0) {
          return res.status(409).json({
            success: false,
            message:
              `Cannot rename this category because ${reportCount} report(s) use it.`
          });
        }
      }

      category.name = newName;
    }

    if (description !== undefined) {
      if (typeof description !== "string") {
        return res.status(400).json({
          success: false,
          message: "Description must be text"
        });
      }

      category.description = description.trim();
    }

    if (isActive !== undefined) {
      if (typeof isActive !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "isActive must be true or false"
        });
      }

      category.isActive = isActive;
    }

    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category
    });
  } catch (error) {
    console.error("Update category error:", error);

    return res.status(error.code === 11000 ? 409 : 500).json({
      success: false,
      message:
        error.code === 11000
          ? "Category name already exists"
          : "Failed to update category"
    });
  }
};

// DELETE CATEGORY
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID"
      });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    const reportCount = await ItemReport.countDocuments(
      categoryReportFilter(category.name)
    );

    if (reportCount > 0) {
      return res.status(409).json({
        success: false,
        message:
          `Cannot delete "${category.name}" because ${reportCount} report(s) use this category.`
      });
    }

    await category.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully"
    });
  } catch (error) {
    console.error("Delete category error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete category"
    });
  }
};

module.exports = {
  getCategories,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
