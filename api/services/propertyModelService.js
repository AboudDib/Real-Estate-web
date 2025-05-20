/**
 * propertyModelService.js
 * 
 * Service layer to manage 360-degree property models in the database.
 * 
 * Provides methods to:
 * - Create a new property model linked to an existing property ID with a model URL.
 * - Retrieve a property model by its model ID.
 * - Retrieve all property models associated with a given property ID.
 * - Delete a property model by its model ID.
 * 
 * Each method performs necessary validation, such as checking if the property or model exists,
 * and throws descriptive errors for proper error handling by calling controllers.
 * 
 * Usage:
 * Import this service into controllers to handle database operations related to 360-degree property models,
 * separating business logic from request handling.
 */

const { PropertyModel } = require('../models/propertyModel');
const { Property } = require('../models/property');

// Create Property Model
exports.createPropertyModel = async (property_id, model_url) => {
  // Check if the property exists
  const property = await Property.findByPk(property_id);
  if (!property) {
    throw new Error('Property not found');
  }

  // Validate model_url
  if (!model_url) {
    throw new Error('model_url is required');
  }

  // Create and return the new property model (360-degree image model)
  return await PropertyModel.create({ property_id, model_url });
};

// Get Property Model by ID
exports.getPropertyModelById = async (model_id) => {
  const propertyModel = await PropertyModel.findByPk(model_id);
  if (!propertyModel) {
    throw new Error('360 Property Model not found');
  }
  return propertyModel;
};

// Get Property Models by Property ID
exports.getPropertyModelsByPropertyId = async (property_id) => {
  // Check if the property exists
  const property = await Property.findByPk(property_id);
  if (!property) {
    throw new Error('Property not found');
  }

  // Fetch and return all property models (360-degree images) for this property
  const propertyModels = await PropertyModel.findAll({
    where: { property_id },
  });
  return propertyModels;
};

// Delete Property Model
exports.deletePropertyModel = async (model_id) => {
  const propertyModel = await PropertyModel.findByPk(model_id);
  if (!propertyModel) {
    throw new Error('360 Property Model not found');
  }

  // Delete the property model and return the deleted data for confirmation
  const deletedModel = await propertyModel.destroy();
  return deletedModel;
};
