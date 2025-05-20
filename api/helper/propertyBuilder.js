/**
 * propertyBuilder.js
 *
 * This utility function enriches a list of property records by attaching their associated images.
 * It uses the propertyImageService to fetch image URLs for each property based on its property_id.
 *
 * Purpose:
 * - Enhance property listings by embedding an `images` field that contains an array of image URLs.
 * - Converts Sequelize model instances into plain JavaScript objects before modification.
 *
 * Input:
 * - properties (Array): A list of Sequelize property model instances or plain objects with a `property_id` key.
 *
 * Output:
 * - Returns a Promise that resolves to an array of property objects, each containing an `images` field.
 *
 * Example Output:
 * [
 *   {
 *     property_id: 123,
 *     title: "Modern Apartment",
 *     location: "Beirut",
 *     ...,
 *     images: [
 *       "https://example.com/image1.jpg",
 *       "https://example.com/image2.jpg"
 *     ]
 *   },
 *   ...
 * ]
 *
 * Notes:
 * - Assumes `property.property_id` is the foreign key used to relate to the images.
 * - Uses `toJSON()` to ensure compatibility with Sequelize model instances.
 */

const propertyImageService = require('../services/propertyImageService'); // Use the service instead of direct DB calls

const attachImagesToProperties = async (properties) => {
  return await Promise.all(
    properties.map(async (property) => {
      // Use property_id instead of id if that's the key used in your database
      const images = await propertyImageService.getImagesByProperty(property.property_id);

      // Attach images (image_url array) to each property
      return {
        ...property.toJSON(),  // Convert Sequelize model to plain object
        images: images.map(img => img.image_url),  // Map image URLs
      };
    })
  );
};

module.exports = { attachImagesToProperties };
