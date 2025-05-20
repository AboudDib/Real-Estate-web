/**
 * propertyImageController.js
 *
 * This controller manages image operations related to property listings in the real estate web application.
 * It enables clients to add, retrieve, and delete images associated with properties.
 * The core logic is delegated to the `propertyImageService`.
 *
 * Key Features:
 * - Add a new image to a property listing
 * - Retrieve all images for a specific property
 * - Delete a specific property image
 *
 * Methods:
 * - addPropertyImage(req, res): Adds a new image to the specified property using its ID.
 * - getPropertyImages(req, res): Retrieves all images associated with a given property ID.
 * - deletePropertyImage(req, res): Deletes a property image by its unique image ID.
 *
 * Dependencies:
 * - express-validator: Validates request inputs.
 * - propertyImageService: Contains the business logic for handling image data in the database.
 *
 * Notes:
 * - Input validation is performed before processing image addition.
 * - Error handling is included for all methods with appropriate status codes and messages.
 * - Assumes that images are stored as URLs and associated with properties via foreign keys.
 */


const { validationResult } = require('express-validator');
const propertyImageService = require('../services/propertyImageService');

// Add Image to Property
exports.addPropertyImage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { image_url, property_id } = req.body;

  try {
    const image = await propertyImageService.addImage(image_url, property_id);
    res.status(201).json({ message: 'Image added successfully', image });
  } catch (error) {
    res.status(400).json({ message: 'Image addition failed', error: error.message });
  }
};

// Get Images for Property
exports.getPropertyImages = async (req, res) => {
  const { propertyId } = req.params;

  try {
    const images = await propertyImageService.getImagesByProperty(propertyId);
    res.status(200).json(images);
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving images', error: error.message });
  }
};

// Delete Image
exports.deletePropertyImage = async (req, res) => {
  const { imageId } = req.params;

  try {
    await propertyImageService.deleteImage(imageId);
    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Image deletion failed', error: error.message });
  }
};
