const express = require('express');
const router = express.Router();
const propertyImageController = require('../controllers/propertyImageController');
const { validateAddImage, validateGetImagesByProperty, validateDeleteImage } = require('../validators/propertyImageValidator');
const authToken = require('../middlewares/authToken');  // Import the authToken middleware

// Route to add an image to a property
router.post('/add', 
  authToken,  // Add the authToken middleware to this route
  validateAddImage, 
  propertyImageController.addPropertyImage
);

// Route to get images for a property
router.get('/:propertyId', 
  authToken,  // Add the authToken middleware to this route
  validateGetImagesByProperty, 
  propertyImageController.getPropertyImages
);

// Route to delete an image
router.delete('/:imageId', 
  authToken,  // Add the authToken middleware to this route
  validateDeleteImage, 
  propertyImageController.deletePropertyImage
);

module.exports = router;
