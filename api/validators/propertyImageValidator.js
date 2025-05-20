const { body, param } = require('express-validator');

// Validator for adding an image
exports.validateAddImage = [
  body('image_url')
    .notEmpty().withMessage('Image URL is required')
    .isURL().withMessage('Image URL must be a valid URL'),
  body('property_id')
    .notEmpty().withMessage('Property ID is required')
    .isInt().withMessage('Property ID must be an integer'),
];

// Validator for getting images by property ID
exports.validateGetImagesByProperty = [
  param('propertyId')
    .notEmpty().withMessage('Property ID is required')
    .isInt().withMessage('Property ID must be an integer'),
];

// Validator for deleting an image
exports.validateDeleteImage = [
  param('imageId')
    .notEmpty().withMessage('Image ID is required')
    .isInt().withMessage('Image ID must be an integer'),
];
