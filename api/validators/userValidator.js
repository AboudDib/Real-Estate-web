const { check } = require('express-validator');

// Register Validator
exports.registerValidator = [
  check('first_name').notEmpty().withMessage('First name is required'),
  check('last_name').notEmpty().withMessage('Last name is required'),
  check('email').isEmail().withMessage('Valid email is required'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  check('phone_number')
    .notEmpty().withMessage('Phone number is required')
    .isInt().withMessage('Phone number must be a valid integer')
    .withMessage('Phone number can only contain digits'),
  check('profile_picture').optional().isURL().withMessage('Profile picture must be a valid URL'), // Added validation for profile picture
  check('description').optional().isLength({ max: 500 }).withMessage('Description can be up to 500 characters'), // Added validation for description
];

// Login Validator
exports.loginValidator = [
  check('email').isEmail().withMessage('Valid email is required'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

// Update User Validator
exports.updateUserValidator = [
  check('first_name').optional().notEmpty().withMessage('First name is required'),
  check('last_name').optional().notEmpty().withMessage('Last name is required'),
  check('email').optional().isEmail().withMessage('Valid email is required'),
  check('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  check('phone_number').optional().notEmpty().withMessage('Phone number is required'),
  check('profile_picture').optional().isURL().withMessage('Profile picture must be a valid URL'), // Added validation for profile picture
  check('description').optional().isLength({ max: 500 }).withMessage('Description can be up to 500 characters'), // Added validation for description
  check('isVerified').optional().isBoolean().withMessage('isVerified must be a boolean value'), // Added validation for isVerified
];
