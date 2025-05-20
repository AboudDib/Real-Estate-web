/**
 * propertyController.js
 *
 * This controller handles all property-related HTTP operations for the real estate web application.
 * It provides endpoints for creating, updating, deleting, retrieving, and approving property listings.
 * Each function delegates business logic to the `propertyService` and interacts with the database via models.
 *
 * Key Features:
 * - Create, update, and delete properties
 * - Fetch properties by various criteria: ID, type, location, user ID, approval status
 * - Dynamically filter properties based on rent/sale, price range, city, year, and other attributes
 * - Approve property listings (admin only)
 *
 * Methods:
 * - createProperty(req, res): Adds a new property to the database after verifying the user.
 * - updateProperty(req, res): Updates an existing property with new details.
 * - deleteProperty(req, res): Deletes a property by ID.
 * - getPropertyById(req, res): Fetches a property by its ID.
 * - getApprovedProperties(req, res): Retrieves all properties that have been approved.
 * - getNonApprovedProperties(req, res): Retrieves all properties awaiting admin approval.
 * - getPropertiesDynamic(req, res): Advanced filter-based search for properties (price, type, city, etc.).
 * - getPropertiesByType(req, res): Fetches properties filtered by type (apartment, villa).
 * - getPropertiesByLocation(req, res): Fetches properties by city and type.
 * - getPropertiesByUserId(req, res): Fetches properties added by a specific user.
 * - approveProperty(req, res): Allows an admin to approve a property listing.
 *
 * Dependencies:
 * - propertyService: Contains business logic for interacting with the property model and database.
 * - User model: Used for user validation and admin checks.
 *
 * Notes:
 * - Includes validation for user existence and admin authorization.
 * - Handles errors with appropriate status codes and messages.
 * - Supports new fields like `furnished` and `year_built` for better property listings.
 */


const propertyService = require('../services/propertyService');
const { User } = require('../models/user');

// Create Property
exports.createProperty = async (req, res) => {
  try {
    const { 
      name, description, city, price, property_type, 
      bedrooms, bathrooms, living_rooms, balconies, 
      parking_spaces, square_meter, user_id, isForRent,
      year_built, furnished // ✅ New fields
    } = req.body;
    console.log(req.body)
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newProperty = await propertyService.createProperty(
      name, description, city, price, property_type, 
      bedrooms, bathrooms, living_rooms, balconies, 
      parking_spaces, square_meter, user_id, isForRent,
      furnished, year_built // ✅ New fields
    );

    res.status(201).json({ message: 'Property created successfully', property: newProperty });
  } catch (error) {
    res.status(400).json({ message: 'Error creating property', error: error.message });
  }
};


// Update Property
exports.updateProperty = async (req, res) => {
  try {
    const { property_id } = req.params;
    const { 
      name, description, city, price, property_type, 
      bedrooms, bathrooms, living_rooms, balconies, 
      parking_spaces, year_built, furnished // ✅ Added
    } = req.body;

    const updatedProperty = await propertyService.updateProperty(
      property_id, name, description, city, price, 
      property_type, bedrooms, bathrooms, living_rooms, 
      balconies, parking_spaces, year_built, furnished // ✅ Pass to service
    );
    res.status(200).json({ message: 'Property updated successfully', property: updatedProperty });
  } catch (error) {
    res.status(400).json({ message: 'Error updating property', error: error.message });
  }
};


// Delete Property
exports.deleteProperty = async (req, res) => {
  try {
    const { property_id } = req.params;
    await propertyService.deleteProperty(property_id);
    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting property', error: error.message });
  }
};

// Get Property by ID
exports.getPropertyById = async (req, res) => {
  try {
    const { property_id } = req.params;
    const property = await propertyService.getPropertyById(property_id);
    res.status(200).json({ property });
  } catch (error) {
    res.status(404).json({ message: 'Property not found', error: error.message });
  }
};

// Get Approved Properties
exports.getApprovedProperties = async (req, res) => {
  try {
    const properties = await propertyService.getApprovedProperties();
    res.status(200).json({ properties });
  } catch (error) {
    res.status(400).json({ message: 'Error fetching approved properties', error: error.message });
  }
};

// ✅ Update Get Properties Dynamic with new fields including userId
exports.getPropertiesDynamic = async (req, res) => {
  try {
    const { 
      isRent, sortBy, city, propertyType, 
      minPrice, maxPrice, minYear, maxYear, furnished,
      userId // ✅ New filter to exclude properties by userId
    } = req.body;

    const properties = await propertyService.getPropertiesDynamic(
      isRent, sortBy, city, propertyType, 
      minPrice, maxPrice, minYear, maxYear, furnished,
      userId // ✅ Pass userId to service
    );

    res.status(200).json(properties);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching properties', error: error.message });
  }
};


// Get Non-Approved Properties
exports.getNonApprovedProperties = async (req, res) => {
  try {
    const properties = await propertyService.getNonApprovedProperties();
    res.status(200).json({ properties });
  } catch (error) {
    res.status(400).json({ message: 'Error fetching non-approved properties', error: error.message });
  }
};

// Get Properties by Type
exports.getPropertiesByType = async (req, res) => {
  try {
    const { property_type } = req.query;
    const properties = await propertyService.getPropertiesByType(property_type);
    res.status(200).json({ properties });
  } catch (error) {
    res.status(400).json({ message: 'Error fetching properties by type', error: error.message });
  }
};

// Get Properties by Location
exports.getPropertiesByLocation = async (req, res) => {
  try {
    const { property_type, city } = req.query;
    const properties = await propertyService.getPropertiesByLocation(property_type, city);
    res.status(200).json({ properties });
  } catch (error) {
    res.status(400).json({ message: 'Error fetching properties by location', error: error.message });
  }
};

// Get Properties by User ID
exports.getPropertiesByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;
    const properties = await propertyService.getPropertiesByUserId(user_id);
    res.status(200).json({ properties });
  } catch (error) {
    res.status(400).json({ message: 'Error fetching properties by user ID', error: error.message });
  }
};

// Approve Property
exports.approveProperty = async (req, res) => {
  try {
    const { property_id } = req.params;
    const { user_id } = req.body;

    const user = await User.findByPk(user_id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'User is not authorized to approve properties' });
    }

    const approvedProperty = await propertyService.approveProperty(property_id);
    res.status(200).json({ message: 'Property approved successfully', property: approvedProperty });
  } catch (error) {
    res.status(400).json({ message: 'Error approving property', error: error.message });
  }
};
