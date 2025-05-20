/**
 * propertyService.js
 * 
 * Service layer to manage property-related database operations.
 * 
 * Provides functions to:
 * - Create a new property with validation to prevent duplicates per user.
 * - Update an existing property by ID, updating only provided fields.
 * - Delete a property by ID.
 * - Retrieve properties by various criteria such as ID, approval status, type, location, or user.
 * - Approve a property listing.
 * - Dynamically fetch properties with flexible filters (rent/sale, city, type, price range, year built, furnished, exclude user).
 * 
 * Some functions attach images to properties using an external helper (propertyBuilder).
 * 
 * Includes internal helper function to build Sequelize "order" arrays for sorting results.
 * 
 * Each method throws detailed errors if a requested property is not found or if any other issue occurs.
 * 
 * Usage:
 * Import and call these functions from controllers to separate business logic and keep controllers clean.
 */

const { Property } = require("../models/property");
const { User } = require("../models/user");
const propertyBuilder = require('../helper/propertyBuilder'); // Import the function
const { Sequelize } = require('sequelize');

exports.createProperty = async (
  name, description, city, price, property_type,
  bedrooms, bathrooms, living_rooms, balconies,
  parking_spaces, square_meter, user_id, isForRent,
  furnished, year_built
) => {
  
  // Check if property with the same name exists for this user
  const existingProperty = await Property.findOne({ where: { name, user_id } });
  if (existingProperty) {
    throw new Error("Property with this name already exists for this user");
  }
  console.log(furnished)
  console.log(property_type);

  // Create the property with all relevant fields
  return await Property.create({
    user_id,
    name,
    description,
    city,
    price,
    property_type,
    bedrooms,
    bathrooms,
    living_rooms,
    balconies,
    parking_spaces,
    square_meter,
    isForRent,
    furnished,
    year_built,
    isApproved: false,
    created_at: new Date(),
  });
};



exports.updateProperty = async (
  property_id, name, description, city, price, property_type,
  bedrooms, bathrooms, living_rooms, balconies,
  parking_spaces, furnished, year_built
) => {
  const property = await Property.findByPk(property_id);
  if (!property) {
    throw new Error("Property not found");
  }

  // Update only the fields provided
  await property.update({
    name,
    description,
    city,
    price,
    property_type,
    bedrooms,
    bathrooms,
    living_rooms,
    balconies,
    parking_spaces,
    furnished,
    year_built,
  });

  return property;
};


// Delete Property
exports.deleteProperty = async (property_id) => {
  const property = await Property.findByPk(property_id);
  if (!property) {
    throw new Error("Property not found");
  }

  await property.destroy();
};

// Get Property by ID
exports.getPropertyById = async (property_id) => {
  const property = await Property.findByPk(property_id);
  if (!property) {
    throw new Error("Property not found");
  }
  return property;
};

// Get Approved Properties
exports.getApprovedProperties = async () => {
  return await Property.findAll({
    where: { isApproved: true },
    order: [["created_at", "DESC"]],
  });
};

exports.getNonApprovedProperties = async () => {
  try {
    let properties = await Property.findAll({
      where: { isApproved: false },
      order: [["created_at", "DESC"]],
    });

    // Attach images to the properties
    properties = await propertyBuilder.attachImagesToProperties(properties); 

    return properties;
  } catch (error) {
    console.error("Error fetching non-approved properties:", error);
    throw new Error("Error fetching non-approved properties");
  }
};


// Get Properties by Type
exports.getPropertiesByType = async (propertyType) => {
  return await Property.findAll({
    where: { property_type: propertyType },
    order: [["created_at", "DESC"]],
  });
};

// Get Properties by Location
exports.getPropertiesByLocation = async (propertyType, city) => {
  try {
    return await Property.findAll({
      where: {
        property_type: propertyType,
        city: city,
      },
      order: [["created_at", "DESC"]],
    });
  } catch (error) {
    console.error("Error fetching properties by location:", error);
    throw new Error("Error fetching properties by location");
  }
};

// Get Properties by User ID with Images
exports.getPropertiesByUserId = async (user_id) => {
  try {
    // Fetch properties from the database
    let properties = await Property.findAll({
      where: { user_id },
      order: [["created_at", "DESC"]],
    });

    console.log("Properties fetched from database:", properties); // Log the properties before attaching images

    // Attach images to the properties
    properties = await propertyBuilder.attachImagesToProperties(properties);

    console.log("Properties with images attached:", properties); // Log the properties after attaching images
    return properties;
  } catch (error) {
    console.error("Error fetching properties by user ID:", error);
    throw new Error("Error fetching properties by user ID");
  }
};


// Approve Property
exports.approveProperty = async (property_id) => {
  const property = await Property.findByPk(property_id);
  if (!property) {
    throw new Error("Property not found");
  }

  property.isApproved = true;
  await property.save();

  return property;
};

exports.getPropertiesDynamic = async (
  isRent = null, sortBy, city = null, propertyType = null,
  minPrice = null, maxPrice = null,
  minYear = null, maxYear = null, furnished = null,
  userId = null
) => {
  console.log("Fetching properties with the following parameters:");
  console.log("isRent:", isRent);
  console.log("sortBy:", sortBy);
  console.log("city:", city);
  console.log("propertyType:", propertyType);
  console.log("minPrice:", minPrice);
  console.log("maxPrice:", maxPrice);
  console.log("minYear:", minYear);
  console.log("maxYear:", maxYear);
  console.log("userId (exclude):", userId);

  // Build the order array based on the sortBy parameter
  const order = buildOrder(sortBy);  
  console.log("Built order array:", order); // Log the order array for debugging

  const whereCondition = { isApproved: true };

  // Add dynamic filters
  if (isRent !== null) whereCondition.isForRent = isRent;
  if (city) whereCondition.city = city;
  if (propertyType) whereCondition.property_type = propertyType;
  if (furnished !== null) whereCondition.furnished = furnished;
  if (userId !== null) whereCondition.user_id = { [Sequelize.Op.ne]: userId };

  // Add year range filters if provided
  if (minYear !== null || maxYear !== null) {
    whereCondition.year_built = {};
    if (minYear !== null) whereCondition.year_built[Sequelize.Op.gte] = minYear;
    if (maxYear !== null) whereCondition.year_built[Sequelize.Op.lte] = maxYear;
  }

  // Add price range filters if provided
  if (minPrice !== null) whereCondition.price = { [Sequelize.Op.gte]: minPrice };
  if (maxPrice !== null) {
    whereCondition.price = {
      ...whereCondition.price,
      [Sequelize.Op.lte]: maxPrice
    };
  }

  console.log("Final whereCondition:", whereCondition); // Log the final where condition for debugging

  try {
    // Fetch properties from the database
    let properties = await Property.findAll({
      where: whereCondition,
      order: order,
    });

    console.log("Properties fetched from database:", properties); // Log the properties before attaching images

    // Attach images to the properties
    properties = await propertyBuilder.attachImagesToProperties(properties); 

    console.log("Properties with images attached:", properties); // Log the properties after attaching images
    return properties;
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw new Error("Error fetching properties");
  }
};


const buildOrder = (sortBy) => {
  const order = [];
  console.log("Building order based on sortBy:", sortBy);  // Log the sortBy value
  
  if (sortBy === 'price_asc') {
    order.push(['price', 'ASC']);
  } else if (sortBy === 'price_desc') {
    order.push(['price', 'DESC']);
  } else if (sortBy === 'date_asc') {
    order.push(['created_at', 'ASC']);
  } else if (sortBy === 'date_desc') {
    order.push(['created_at', 'DESC']);
  } else if (sortBy === 'year_asc') {
    order.push(['year_built', 'ASC']);
  } else if (sortBy === 'year_desc') {
    order.push(['year_built', 'DESC']);
  }

  console.log("Final order array:", order); // Log the final order array
  return order;
};
