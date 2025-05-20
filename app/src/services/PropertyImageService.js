/**
 * PropertyImageService
 * --------------------
 * This service provides methods to manage property images through API calls.
 * 
 * Functions:
 *  - addPropertyImage(imageUrl, propertyId): Adds a new image URL to a specified property.
 *  - getPropertyImages(propertyId): Retrieves all images associated with a specific property.
 *  - deletePropertyImage(imageId): Deletes an image by its ID.
 * 
 * Implementation details:
 *  - Uses an authorization token stored in localStorage for protected endpoints.
 *  - Handles API errors using a centralized error handler (handleApiError).
 *  - Sends HTTP requests using the configured HTTP client instance (http).
 * 
 * Usage:
 *  Import this service to perform CRUD operations on property images.
 * 
 * Note:
 *  Ensure your backend endpoints '/property-images/*' are properly configured to handle these requests.
 */

import http from "../http-common";
import handleApiError from "../utils/apiErrorHandler";

// Function to get the token
const getToken = () => {
  return localStorage.getItem("token");  // Assuming token is stored in localStorage
};
// Add Image to Property
const addPropertyImage = async (imageUrl, propertyId) => {
  try {
    const token = getToken();
    const response = await http.post(
      "/property-images/add",
      {
        image_url: imageUrl,
        property_id: propertyId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get Images for Property
const getPropertyImages = async (propertyId) => {
  try {
    const response = await http.get(`/property-images/${propertyId}`);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

// Delete Image
const deletePropertyImage = async (imageId) => {
  try {
    const response = await http.delete(`/property-images/${imageId}`);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

// Export the service methods
const PropertyImageService = {
  addPropertyImage,
  getPropertyImages,
  deletePropertyImage,
};

export default PropertyImageService;
