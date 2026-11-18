
const VALID_TYPES = ["lost", "found"];

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
const createReport = (req, res) => {
  // Validate request body before destructuring
  if (
    !req.body ||
    typeof req.body !== "object" ||
    Array.isArray(req.body)
  ) {
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

  // Database integration pending
  return res.status(501).json({
    success: false,
    message: "Report validation passed. Database integration pending.",
    validatedData: {
      type,
      itemName: itemName.trim(),
      category: category.trim(),
      description: description.trim(),
      location: location.trim(),
      eventDate,
      contact: typeof contact === "string" ? contact.trim() : null
    }
  });
};

// GET REPORTS + SEARCH + PAGINATION + SORTING
const getReports = (req, res) => {
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

  // Validate report type
  if (type !== undefined && !VALID_TYPES.includes(type)) {
    return res.status(400).json({
      success: false,
      message: "type must be 'lost' or 'found'"
    });
  }

  // Validate dates
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

  // Validate pagination parameters
  const isPositiveInteger = (value) => {
    return /^[1-9]\d*$/.test(value);
  };

  if (
    !isPositiveInteger(page) ||
    !Number.isSafeInteger(Number(page))
  ) {
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

  // Prevent unsafe pagination offset
  const offset = (pageNumber - 1) * limitNumber;

  if (!Number.isSafeInteger(offset)) {
    return res.status(400).json({
      success: false,
      message: "Pagination offset is too large"
    });
  }

  // Normalize search filters
  const normalizedFilters = {
    keyword: keyword?.trim() || null,
    category: category?.trim() || null,
    location: location?.trim() || null,
    type: type || null,
    fromDate: fromDate || null,
    toDate: toDate || null,
    status: "approved",
    activeOnly: true
  };

  // Pagination configuration
  const pagination = {
    page: pageNumber,
    limit: limitNumber,
    offset
  };

  // Sorting configuration
  const sorting = {
    sort,
    order: sort === "newest" ? "desc" : "asc"
  };

  // Actual MongoDB query will be integrated later
  return res.status(501).json({
    success: false,
    message: "Search, pagination and sorting validated. Database integration pending.",
    filters: normalizedFilters,
    pagination,
    sorting
  });
};

// GET SINGLE REPORT
const getReportById = (req, res) => {
  const { id } = req.params;

  // Validate MongoDB ObjectID format
  const objectIdPattern = /^[a-fA-F0-9]{24}$/;

  if (!objectIdPattern.test(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid report ID format"
    });
  }

  // Actual database lookup will be added later
  return res.status(501).json({
    success: false,
    message: "Report ID validated. Database integration pending.",
    reportId: id
  });
};

// UPDATE REPORT
const updateReport = (req, res) => {
  const { id } = req.params;

  // Validate MongoDB ObjectID
  const objectIdPattern = /^[a-fA-F0-9]{24}$/;

  if (!objectIdPattern.test(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid report ID format"
    });
  }

  // Validate request body
  if (
    !req.body ||
    typeof req.body !== "object" ||
    Array.isArray(req.body)
  ) {
    return res.status(400).json({
      success: false,
      message: "A valid JSON object is required"
    });
  }

  // Only these fields can be updated
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

  // Reject empty update requests
  if (updates.length === 0) {
    return res.status(400).json({
      success: false,
      message: "At least one field is required for update"
    });
  }

  // Reject unauthorized fields
  const invalidFields = updates.filter(
    (field) => !allowedFields.includes(field)
  );

  if (invalidFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Fields cannot be updated: ${invalidFields.join(", ")}`
    });
  }

  const validatedUpdates = {};

  // Validate submitted fields
  for (const field of updates) {
    const value = req.body[field];

    if (field === "lostDate" || field === "foundDate") {
      if (!isValidDate(value)) {
        return res.status(400).json({
          success: false,
          message: `${field} must be a valid YYYY-MM-DD date`
        });
      }

      validatedUpdates[field] = value;
    } else {
      if (typeof value !== "string" || !value.trim()) {
        return res.status(400).json({
          success: false,
          message: `${field} must be a non-empty string`
        });
      }

      validatedUpdates[field] = value.trim();
    }
  }

  // Database update and ownership verification pending
  return res.status(501).json({
    success: false,
    message: "Update validation passed. Database and authentication integration pending.",
    reportId: id,
    validatedUpdates
  });
};

// WITHDRAW REPORT
const withdrawReport = (req, res) => {
  const { id } = req.params;

  // Validate MongoDB ObjectID format
  const objectIdPattern = /^[a-fA-F0-9]{24}$/;

  if (!objectIdPattern.test(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid report ID format"
    });
  }

  // Database and authentication integration pending
  return res.status(501).json({
    success: false,
    message: "Withdraw request validated. Database and authentication integration pending.",
    reportId: id
  });
};

// EXPORT CONTROLLERS
module.exports = {
  createReport,
  getReports,
  getReportById,
  updateReport,
  withdrawReport
};
