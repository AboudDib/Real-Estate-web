const express = require('express');
const router = express.Router();
const propertyModelController = require('../controllers/propertyModelController');
const propertyModelValidator = require('../validators/propertyModelValidator');
const { validate } = require('../middlewares/validationMiddleware');
const authToken = require('../middlewares/authToken');  // Import the authToken middleware

// Create Property Model
router.post('/add', 
  authToken,  // Add the authToken middleware to this route
  propertyModelValidator.createPropertyModelValidator, 
  validate, 
  propertyModelController.createPropertyModel
);

// Get Property Model by ID
router.get('/:id', 
  authToken,  // Add the authToken middleware to this route
  propertyModelController.getPropertyModelById
);

// Get Property Models by Property ID
router.get('/property/:property_id', 
  authToken,  // Add the authToken middleware to this route
  propertyModelController.getPropertyModelsByPropertyId
);

// Delete Property Model
router.delete('/:id', 
  authToken,  // Add the authToken middleware to this route
  propertyModelController.deletePropertyModel
);

module.exports = router;
