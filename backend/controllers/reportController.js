const ItemReport = require("../models/ItemReport");

const VALID_TYPES = ["lost", "found"];


// Escape regex special characters in user search input
const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};


// Helper: Validate YYYY-MM-DD dates
const isValidDate = (value) => {
  if (typeof value !== "string") return false;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(value);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
};

// CREATE LOST / FOUND REPORT
const createReport = async (req, res) => {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    return res.status(400).json({
      success: false,
      message: "A valid JSON object is required"
    });
  }

  const {
    type,
    itemName,
    category,
    description,
    location,
    lostDate,
    foundDate,
    contact
  } = req.body;

  if (!VALID_TYPES.includes(type)) {
    return res.status(400).json({
      success: false,
      message: "Report type must be 'lost' or 'found'"
    });
  }

  const requiredFields = {
    itemName,
    category,
    description,
    location
  };

  for (const [field, value] of Object.entries(requiredFields)) {
    if (typeof value !== "string" || !value.trim()) {
      return res.status(400).json({
        success: false,
        message: `${field} is required`
      });
    }
  }

  const eventDate = type === "lost" ? lostDate : foundDate;

  if (!isValidDate(eventDate)) {
    return res.status(400).json({
      success: false,
      message: `Valid ${type === "lost" ? "lostDate" : "foundDate"} is required`
    });
  }

  try {
    const report = await ItemReport.create({
      type,
      itemName: itemName.trim(),
      category: category.trim(),
      description: description.trim(),
      location: location.trim(),
      eventDate,
      contact: typeof contact === "string" ? contact.trim() : null,
      user: req.user._id,
      status: "approved",
      isActive: true
    });

    return res.status(201).json({
      success: true,
      message: "Report created successfully",
      data: report
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating report",
      error: error.message
    });
  }
};

// GET REPORTS + SEARCH + PAGINATION + SORTING

const getReports = async (req, res) => {
  const {
    keyword,
    category,
    location,
    type,
    fromDate,
    toDate,
    page = "1",
    limit = "10",
    sort = "newest"
  } = req.query;

  const filters = {
    keyword,
    category,
    location,
    type,
    fromDate,
    toDate,
    page,
    limit,
    sort
  };

  // Validate query parameter types
  for (const [field, value] of Object.entries(filters)) {
    if (value !== undefined && typeof value !== "string") {
      return res.status(400).json({
        success: false,
        message: `${field} must be a single string`
      });
    }
  }

  // Validate search input lengths
  const searchFields = {
    keyword: 100,
    category: 100,
    location: 150
  };

  for (const [field, maxLength] of Object.entries(searchFields)) {
    const value = filters[field];

    if (value !== undefined) {
      if (!value.trim()) {
        return res.status(400).json({
          success: false,
          message: `${field} cannot be empty`
        });
      }

      if (value.trim().length > maxLength) {
        return res.status(400).json({
          success: false,
          message: `${field} cannot exceed ${maxLength} characters`
        });
      }
    }
  }

  // Validate report type
  if (type !== undefined && !VALID_TYPES.includes(type)) {
    return res.status(400).json({
      success: false,
      message: "type must be 'lost' or 'found'"
    });
  }

  // Validate date filters
  if (
    (fromDate !== undefined && !isValidDate(fromDate)) ||
    (toDate !== undefined && !isValidDate(toDate))
  ) {
    return res.status(400).json({
      success: false,
      message: "Dates must be valid YYYY-MM-DD values"
    });
  }

  if (fromDate && toDate && fromDate > toDate) {
    return res.status(400).json({
      success: false,
      message: "fromDate cannot be after toDate"
    });
  }

  // Validate pagination
  const isPositiveInteger = (value) => /^[1-9]\d*$/.test(value);

  if (!isPositiveInteger(page) || !Number.isSafeInteger(Number(page))) {
    return res.status(400).json({
      success: false,
      message: "page must be a positive integer"
    });
  }

  if (
    !isPositiveInteger(limit) ||
    !Number.isSafeInteger(Number(limit)) ||
    Number(limit) > 100
  ) {
    return res.status(400).json({
      success: false,
      message: "limit must be between 1 and 100"
    });
  }

  // Validate sorting
  const allowedSortValues = ["newest", "oldest"];

  if (!allowedSortValues.includes(sort)) {
    return res.status(400).json({
      success: false,
      message: "sort must be 'newest' or 'oldest'"
    });
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  if (!Number.isSafeInteger(skip)) {
    return res.status(400).json({
      success: false,
      message: "Pagination offset is too large"
    });
  }

  // Build MongoDB query
  const query = {
    isActive: true,
    status: "approved"
  };

  if (type) {
    query.type = type;
  }

  if (category) {
    query.category = {
      $regex: new RegExp(escapeRegex(category.trim()), "i")
    };
  }

  if (location) {
    query.location = {
      $regex: new RegExp(escapeRegex(location.trim()), "i")
    };
  }

  if (keyword) {
    const safeKeyword = new RegExp(
      escapeRegex(keyword.trim()),
      "i"
    );

    query.$or = [
      { itemName: { $regex: safeKeyword } },
      { description: { $regex: safeKeyword } }
    ];
  }

  if (fromDate || toDate) {
    query.eventDate = {};

    if (fromDate) query.eventDate.$gte = fromDate;
    if (toDate) query.eventDate.$lte = toDate;
  }

  const sortOrder = sort === "newest" ? -1 : 1;

  try {
    const total = await ItemReport.countDocuments(query);

    const reports = await ItemReport.find(query)
      .populate("user", "name email")
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(limitNumber);

    return res.status(200).json({
      success: true,
      count: reports.length,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber) || 1,
        totalRecords: total
      },
      data: reports
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching reports",
      error: error.message
    });
  }
};

// GET USER'S OWN REPORTS
const getMyReports = async (req, res) => {
  try {
    const reports = await ItemReport.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching user reports",
      error: error.message
    });
  }
};

// GET SINGLE REPORT BY ID

const getReportById = async (req, res) => {
  const { id } = req.params;

  const objectIdPattern = /^[a-fA-F0-9]{24}$/;

  if (!objectIdPattern.test(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid report ID format"
    });
  }

  try {
    // Only approved and active reports are publicly visible
    const report = await ItemReport.findOne({
      _id: id,
      status: "approved",
      isActive: true
    }).populate("user", "name email");

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: report
    });

  } catch (error) {
    console.error("Error fetching report:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching report"
    });
  }
};


// UPDATE REPORT (Ownership verified by middleware)

const updateReport = async (req, res) => {
  // Ownership already verified by middleware
  const report = req.report;

  // Prevent editing withdrawn or inactive reports
  if (report.status === "withdrawn" || report.isActive === false) {
    return res.status(409).json({
      success: false,
      message: "Cannot update a withdrawn or inactive report"
    });
  }

  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    return res.status(400).json({
      success: false,
      message: "A valid JSON object is required"
    });
  }

  const allowedFields = [
    "itemName",
    "category",
    "description",
    "location",
    "lostDate",
    "foundDate",
    "contact"
  ];

  const updates = Object.keys(req.body);

  if (updates.length === 0) {
    return res.status(400).json({
      success: false,
      message: "At least one field is required for update"
    });
  }

  const invalidFields = updates.filter(
    (field) => !allowedFields.includes(field)
  );

  if (invalidFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Fields cannot be updated: ${invalidFields.join(", ")}`
    });
  }

  // Validate date field against report type
  const correctDateField =
    report.type === "lost" ? "lostDate" : "foundDate";

  for (const field of updates) {
    const value = req.body[field];

    if (field === "lostDate" || field === "foundDate") {
      if (field !== correctDateField) {
        return res.status(400).json({
          success: false,
          message: `Only ${correctDateField} can be updated for this report`
        });
      }

      if (!isValidDate(value)) {
        return res.status(400).json({
          success: false,
          message: `${field} must be a valid YYYY-MM-DD date`
        });
      }

      report.eventDate = value;
    } else {
      if (typeof value !== "string" || !value.trim()) {
        return res.status(400).json({
          success: false,
          message: `${field} must be a non-empty string`
        });
      }

      report[field] = value.trim();
    }
  }

  try {
    await report.save();

    return res.status(200).json({
      success: true,
      message: "Report updated successfully",
      data: report
    });
  } catch (error) {
    console.error("Report update failed:", error);

    return res.status(500).json({
      success: false,
      message: "Error updating report"
    });
  }
};


// WITHDRAW REPORT (Ownership verified by middleware)

const withdrawReport = async (req, res) => {
  const report = req.report; // Set by verifyReportOwnership middleware

  try {
    // Prevent withdrawing an already withdrawn report
    if (report.status === "withdrawn" || report.isActive === false) {
      return res.status(409).json({
        success: false,
        message: "This report has already been withdrawn"
      });
    }

    report.status = "withdrawn";
    report.isActive = false;

    await report.save();

    return res.status(200).json({
      success: true,
      message: "Report successfully withdrawn",
      data: report
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error withdrawing report",
      error: error.message
    });
  }
};


module.exports = {
  createReport,
  getReports,
  getMyReports,
  getReportById,
  updateReport,
  withdrawReport
};
