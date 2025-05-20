/**
 * PropertyModelService
 * --------------------
 * This service manages 3D property models through API requests.
 * 
 * Functions:
 *  - createPropertyModel({ property_id, model_url }): Adds a new 3D model URL linked to a specific property.
 *  - getPropertyModelById(modelId): Retrieves a single property model by its unique model ID.
 *  - getPropertyModelsByPropertyId(propertyId): Retrieves all 3D models associated with a given property.
 *  - deletePropertyModel(modelId): Deletes a property model by its unique model ID.
 * 
 * Implementation details:
 *  - Uses an authorization token from localStorage for protected API endpoints.
 *  - Handles errors using a centralized error handler (handleApiError).
 *  - Makes HTTP requests via the configured http client.
 * 
 * Usage:
 *  Import this service to interact with the backend API for CRUD operations on property 3D models.
 * 
 * Note:
 *  Ensure your backend routes `/property-model/*` are correctly set up and secured.
 */

import http from "../http-common";
import handleApiError from "../utils/apiErrorHandler";  // Import the reusable error handler

// Function to get the token
const getToken = () => {
  return localStorage.getItem("token");  // Assuming token is stored in localStorage
};

// Create Property Model
const createPropertyModel = async ({ property_id, model_url }) => {
  try {
    const token = getToken();
    const response = await http.post(
      "/property-model/add",
      {
        property_id,
        model_url,
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

// Get Property Model by ID
const getPropertyModelById = async (modelId) => {
  try {
    const token = getToken();
    const response = await http.get(
      `/property-model/${modelId}`,
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

// Get Property Models by Property ID
const getPropertyModelsByPropertyId = async (propertyId) => {
  try {
    const token = getToken();
    const response = await http.get(
      `/property-model/property/${propertyId}`,
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

// Delete Property Model
const deletePropertyModel = async (modelId) => {
  try {
    const token = getToken();
    const response = await http.delete(
      `/property-model/${modelId}`,
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

// Export the service methods
const PropertyModelService = {
  createPropertyModel,
  getPropertyModelById,
  getPropertyModelsByPropertyId,
  deletePropertyModel,
};

export default PropertyModelService;
