/**
 * propertyModelController.js
 *
 * This controller manages 360 img URL to operations in the real estate web application.
 * It allows clients to create, retrieve, and delete 360 img URL to entries associated with properties.
 * The actual business logic is handled in the `propertyModelService`.
 *
 * Key Features:
 * - Add a 360 img URL to a specific property
 * - Retrieve a single 360 img URL to by its ID
 * - Retrieve all 360 img URL to for a given property
 * - Delete a 360 img URL to by its ID
 *
 * Middleware:
 * - handleValidationErrors: Checks for request validation errors before proceeding to main logic.
 *
 * Methods:
 * - createPropertyModel: Validates and creates a new 3D model entry linked to a property ID.
 * - getPropertyModelById: Retrieves a 3D model by its unique model ID.
 * - getPropertyModelsByPropertyId: Lists all 3D models associated with a specific property.
 * - deletePropertyModel: Deletes a specific 3D model entry by ID.
 *
 * Dependencies:
 * - express-validator: Ensures request input validity.
 * - propertyModelService: Handles database interactions for property model records.
 *
 * Notes:
 * - Assumes 3D models are stored remotely and accessed via a URL.
 * - Proper error handling with HTTP status codes is implemented for robust API responses.
 */

const { validationResult } = require('express-validator');
const propertyModelService = require('../services/propertyModelService');

// Middleware for handling validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Create Property Model
exports.createPropertyModel = [
  handleValidationErrors,
  async (req, res) => {
    try {
      const { property_id, model_url } = req.body;  // Removed format attribute
      const newPropertyModel = await propertyModelService.createPropertyModel(property_id, model_url);
      res.status(201).json({ message: '3D Property Model created successfully', propertyModel: newPropertyModel });
    } catch (error) {
      res.status(500).json({ message: 'Failed to create 3D property model', error: error.message });
    }
  }
];

// Get Property Model by ID
exports.getPropertyModelById = async (req, res) => {
  try {
    const { id } = req.params;
    const propertyModel = await propertyModelService.getPropertyModelById(id);
    if (!propertyModel) {
      return res.status(404).json({ message: '3D property model not found' });
    }
    res.status(200).json({ propertyModel });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve 3D property model', error: error.message });
  }
};

// Get Property Models by Property ID
exports.getPropertyModelsByPropertyId = async (req, res) => {
  try {
    const { property_id } = req.params;
    const propertyModels = await propertyModelService.getPropertyModelsByPropertyId(property_id);
    if (!propertyModels || propertyModels.length === 0) {
      return res.status(404).json({ message: 'No 3D property models found for this property' });
    }
    res.status(200).json({ propertyModels });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve 3D property models', error: error.message });
  }
};

// Delete Property Model
exports.deletePropertyModel = async (req, res) => {
  try {
    const { id } = req.params;
    const propertyModel = await propertyModelService.getPropertyModelById(id);
    if (!propertyModel) {
      return res.status(404).json({ message: '3D property model not found' });
    }
    await propertyModelService.deletePropertyModel(id);
    res.status(200).json({ message: '3D Property Model deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete 3D property model', error: error.message });
  }
};
