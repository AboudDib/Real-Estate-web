/**
 * propertyImageService.js
 * 
 * Service layer to manage property images in the database.
 * 
 * This service provides methods to add a new image URL to a property,
 * retrieve all images associated with a specific property (ordered by image ID),
 * and delete an image by its ID.
 * 
 * Each method handles possible errors by throwing an Error with a descriptive message,
 * so that the calling controller can handle these errors appropriately.
 * 
 * Methods:
 * - addImage(image_url, property_id): Adds a new image URL linked to a property ID.
 * - getImagesByProperty(propertyId): Retrieves all images for the specified property ID,
 *   ordered ascending by image ID.
 * - deleteImage(imageId): Deletes an image by its image ID; throws error if image not found.
 * 
 * Usage:
 * Import this service in controllers to perform image-related database operations,
 * keeping database logic separated from request handling.
 * 
 * Example:
 * const image = await propertyImageService.addImage('https://...', 123);
 * const images = await propertyImageService.getImagesByProperty(123);
 * await propertyImageService.deleteImage(456);
 */
const { PropertyImage } = require('../models/propertyImage');

// Add Image to Property
exports.addImage = async (image_url, property_id) => {
  try {
    const image = await PropertyImage.create({
      image_url,
      property_id,
    });
    return image;
  } catch (error) {
    throw new Error('Failed to add image: ' + error.message);
  }
};

// Get Images by Property ID
exports.getImagesByProperty = async (propertyId) => {
  try {
    const images = await PropertyImage.findAll({
      where: { property_id: propertyId },
      order: [['image_id', 'ASC']], // Order by image_id in ascending order
    });
    return images;
  } catch (error) {
    throw new Error('Failed to retrieve images: ' + error.message);
  }
};

// Delete Image by ID
exports.deleteImage = async (imageId) => {
  try {
    const image = await PropertyImage.findByPk(imageId);
    if (!image) {
      throw new Error('Image not found');
    }
    await image.destroy(); // Delete the image
  } catch (error) {
    throw new Error('Failed to delete image: ' + error.message);
  }
};
