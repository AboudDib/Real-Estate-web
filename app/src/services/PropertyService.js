/**
 * PropertyService
 * ---------------
 * This service provides API interactions related to property management.
 * It covers creating, updating, deleting, retrieving, and approving properties,
 * as well as filtering properties based on various criteria.
 * 
 * All requests that require authorization include a JWT token from localStorage.
 * Errors are centrally handled via the handleApiError utility.
 * 
 * Methods:
 *  - createProperty(propertyData): Creates a new property with the given data.
 *  - updateProperty(propertyId, propertyData): Updates an existing property by ID.
 *  - deleteProperty(propertyId): Deletes a property by its ID.
 *  - getPropertyById(propertyId): Fetches detailed information for a property by ID.
 *  - getPropertiesByUserId(userId): Retrieves all properties posted by a specific user.
 *  - getApprovedProperties(): Retrieves all properties approved for listing.
 *  - getNonApprovedProperties(): Retrieves properties pending approval.
 *  - approveProperty(propertyId, user_id): Approves a property and associates the approving user.
 *  - getPropertiesByType(propertyType): Fetches properties filtered by type (e.g., apartment, villa).
 *  - getPropertiesByLocation(propertyType, city): Fetches properties filtered by type and city.
 *  - getPropertiesDynamic(filters): Retrieves properties based on multiple dynamic filters 
 *      such as rent status, sorting, city, type, price range, year range, furnished status, and user ID.
 * 
 * Usage:
 * Import this service to perform CRUD and filtering operations on properties in the backend.
 */

import http from "../http-common";
import handleApiError from "../utils/apiErrorHandler";  // Reusable error handler

// Function to get the token
const getToken = () => {
  return localStorage.getItem("token");  // Assuming token is stored in localStorage
};

// Create Property
const createProperty = async (propertyData) => {
  try {
    const token = getToken();
    const response = await http.post("/property/create", propertyData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Log the response to see the full details
    console.log("Property created, response:", response);

    return response;
  } catch (error) {
    console.error("Error in property creation:", error); // Log any errors
    return handleApiError(error);
  }
};


// Update Property
const updateProperty = async (propertyId, propertyData) => {
  try {
    const token = getToken();
    const response = await http.put(`/property/update/${propertyId}`, propertyData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

// Delete Property
const deleteProperty = async (propertyId) => {
  try {
    const token = getToken();
    const response = await http.delete(`/property/delete/${propertyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get Property by ID
const getPropertyById = async (propertyId) => {
  try {
    const token = getToken();
    const response = await http.get(`/property/get/${propertyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get Properties by User ID
const getPropertiesByUserId = async (userId) => {
  try {
    const token = getToken();
    const response = await http.get(`/property/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get Approved Properties
const getApprovedProperties = async () => {
  try {
    const token = getToken();
    const response = await http.get("/property/approved", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get Non-Approved Properties
const getNonApprovedProperties = async () => {
  try {
    const token = getToken();
    const response = await http.get("/property/non-approved", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

// Approve Property
const approveProperty = async (propertyId, user_id) => {
  try {
    const token = getToken();
    console.log(user_id)
    const response = await http.put(
      `/property/approve/${propertyId}`,
      { user_id },  // Send userId in the request body
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


// Get Properties by Type (apartments, villas)
const getPropertiesByType = async (propertyType) => {
  try {
    const token = getToken();
    const response = await http.get(`/property/type/${propertyType}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get Properties by Location (filtered by type and city)
const getPropertiesByLocation = async (propertyType, city) => {
  try {
    const token = getToken();
    const response = await http.get("/property/location", {
      params: { propertyType, city },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

const getPropertiesDynamic = async ({ 
  isRent, sortBy, city, propertyType, 
  minPrice, maxPrice, minYear, maxYear, 
  furnished, userId 
}) => {
  try {
    const token = getToken();
    console.log("Token:", token);  // Debugging token

    const response = await http.post("/property/dynamic", {
      isRent,
      sortBy,
      city,
      propertyType,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      furnished,
      userId,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};



// Export the service methods
const PropertyService = {
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertyById,
  getPropertiesByUserId,
  getApprovedProperties,
  getNonApprovedProperties,
  approveProperty,
  getPropertiesByType,
  getPropertiesByLocation,
  getPropertiesDynamic,
};

export default PropertyService;
``
