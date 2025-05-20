const { body, param } = require('express-validator');

exports.validateCreateProperty = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string'),

  body('description')
    .notEmpty().withMessage('Description is required')
    .isString().withMessage('Description must be a string'),

  body('city')
    .notEmpty().withMessage('City is required')
    .isString().withMessage('City must be a string'),

  body('price')
    .notEmpty().withMessage('Price is required')
    .isDecimal().withMessage('Price must be a valid number'),

  body('property_type')
    .notEmpty().withMessage('Property type is required')
    .isIn(['house', 'apartment', 'villa']).withMessage('Property type must be one of house, apartment, or villa'),

  body('user_id')
    .notEmpty().withMessage('User ID is required')
    .isInt().withMessage('User ID must be an integer'),

  body('square_meter')
    .if(body('property_type').equals('house'))
    .notEmpty().withMessage('Square meter is required for house properties')
    .isInt().withMessage('Square meter must be a valid integer'),

  body('isForRent')
    .if(body('property_type').equals('house'))
    .isBoolean().withMessage('For Rent flag must be a boolean')
    .optional(), // Optional, only required for houses

  body('year_built') // ✅ Required
    .notEmpty().withMessage('Year built is required')
    .isInt({ min: 1800, max: new Date().getFullYear() }).withMessage('Year built must be a valid year'),

  body('furnished') // ✅ Required
    .notEmpty().withMessage('Furnished is required')
    .isBoolean().withMessage('Furnished must be a boolean'),
];


// Validator for getting a property by ID
exports.validateGetPropertyById = [
  param('property_id')
    .notEmpty().withMessage('Property ID is required')
    .isInt().withMessage('Property ID must be an integer'),
];

// Validator for updating a property
exports.validateUpdateProperty = [
  param('property_id')
    .notEmpty().withMessage('Property ID is required')
    .isInt().withMessage('Property ID must be an integer'),

  body('name')
    .optional()
    .isString().withMessage('Name must be a string'),

  body('description')
    .optional()
    .isString().withMessage('Description must be a string'),

  body('city')
    .optional()
    .isString().withMessage('City must be a string'),

  body('price')
    .optional()
    .isDecimal().withMessage('Price must be a valid number'),

  body('property_type')
    .optional()
    .isIn(['house', 'apartment', 'villa']).withMessage('Property type must be one of house, apartment, or villa'),

  body('user_id')
    .optional()
    .isInt().withMessage('User ID must be an integer'),

  body('square_meter')
    .if(body('property_type').equals('house'))
    .notEmpty().withMessage('Square meter is required for house properties')
    .isInt().withMessage('Square meter must be a valid integer'),

  body('isForRent')
    .if(body('property_type').equals('house'))
    .isBoolean().withMessage('For Rent flag must be a boolean')
    .optional(),

    body('year_built') // ✅ Required
    .notEmpty().withMessage('Year built is required')
    .isInt({ min: 1800, max: new Date().getFullYear() }).withMessage('Year built must be a valid year'),

  body('furnished') // ✅ Required
    .notEmpty().withMessage('Furnished is required')
    .isBoolean().withMessage('Furnished must be a boolean'),
];

// Validator for deleting a property
exports.validateDeleteProperty = [
  param('property_id')
    .notEmpty().withMessage('Property ID is required')
    .isInt().withMessage('Property ID must be an integer'),
];

exports.validateGetPropertiesByLocation = [
  body('city')
    .notEmpty().withMessage('City is required')
    .isString().withMessage('City must be a string')
    .trim()
    .isLength({ min: 3 }).withMessage('City must be at least 3 characters long'),
];

const currentYear = new Date().getFullYear(); // Get the current year

// Validator for getting properties dynamically (sorting, filtering by city, property type, and price range)
exports.validateGetPropertiesDynamic = [
  body('isRent')
    .isBoolean().withMessage('isRent should be a boolean value')
    .optional({ checkFalsy: true }),

  body('sortBy')
    .isIn(['price_asc', 'price_desc', 'date_asc', 'date_desc', 'year_asc', 'year_desc']) // Added year sorting
    .withMessage('sortBy must be one of price_asc, price_desc, date_asc, date_desc, year_asc, or year_desc')
    .optional({ checkFalsy: true }),

  body('city')
    .optional()
    .isString().withMessage('City must be a string')
    .trim()
    .isLength({ min: 3 }).withMessage('City must be at least 3 characters long'),

  body('propertyType')
    .optional()
    .isIn(['villa', 'apartment'])
    .withMessage('propertyType must be one of Villa or Apartment'),

  body('minPrice')
    .optional()
    .isNumeric().withMessage('minPrice must be a numeric value')
    .custom((value, { req }) => value <= req.body.maxPrice || !req.body.maxPrice)
    .withMessage('minPrice cannot be greater than maxPrice'),

  body('maxPrice')
    .optional()
    .isNumeric().withMessage('maxPrice must be a numeric value')
    .custom((value, { req }) => value >= req.body.minPrice || !req.body.minPrice)
    .withMessage('maxPrice cannot be less than minPrice'),

  body('furnished') // ✅ Added
    .optional()
    .isBoolean().withMessage('Furnished must be a boolean'),

  body('minYearBuilt') // ✅ Added
    .optional()
    .isInt({ min: 1800, max: currentYear }).withMessage(`minYearBuilt must be between 1800 and the current year (${currentYear})`),

  body('maxYearBuilt') // ✅ Added
    .optional()
    .isInt({ min: 1900, max: currentYear }).withMessage(`maxYearBuilt must be between 1800 and the current year (${currentYear})`)
    .custom((value, { req }) => !req.body.minYearBuilt || value >= req.body.minYearBuilt)
    .withMessage('maxYearBuilt must be greater than or equal to minYearBuilt'),
    
    body('userId') // ✅ New userId validation
    .optional()
    .isInt({ min: 1 }).withMessage('userId must be a positive integer'),
];
