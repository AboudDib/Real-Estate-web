const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const propertyValidator = require('../validators/propertyValidator');
const { validate } = require('../middlewares/validationMiddleware');
const authToken = require('../middlewares/authToken');

// Create Property
router.post(
  '/create',
  authToken,
  propertyValidator.validateCreateProperty,
  validate,
  propertyController.createProperty
);

// Update Property
router.put(
  '/update/:property_id',
  authToken,
  propertyValidator.validateUpdateProperty,
  validate,
  propertyController.updateProperty
);

// Delete Property
router.delete(
  '/delete/:property_id',
  authToken,
  propertyValidator.validateDeleteProperty,
  validate,
  propertyController.deleteProperty
);

// Get Property by ID
router.get(
  '/get/:property_id',
  authToken,
  propertyValidator.validateGetPropertyById,
  validate,
  propertyController.getPropertyById
);

// Get Properties by User ID
router.get(
  '/user/:user_id',
  authToken,
  validate,
  propertyController.getPropertiesByUserId
);

// Get Approved Properties
router.get(
  '/approved',
  authToken,
  validate,
  propertyController.getApprovedProperties
);

// Get Non-Approved Properties
router.get(
  '/non-approved',
  authToken,
  validate,
  propertyController.getNonApprovedProperties
);

// Approve Property
router.put(
  '/approve/:property_id',
  authToken,
  validate,
  propertyController.approveProperty
);

// Get Properties by Type (apartments, villas)
router.get(
  '/type/:propertyType',
  authToken,
  validate,
  propertyController.getPropertiesByType
);

// Get Properties by Location
router.get(
  '/location',
  propertyValidator.validateGetPropertiesByLocation,
  authToken,
  validate,
  propertyController.getPropertiesByLocation
);

// Get Properties Dynamically (sorting, filtering by city and property type)
router.post(
  '/dynamic',
  propertyValidator.validateGetPropertiesDynamic,  // Validator for dynamic properties
  authToken,
  validate,  // Middleware for handling validation errors
  propertyController.getPropertiesDynamic  // Controller function to get properties
);

module.exports = router;
