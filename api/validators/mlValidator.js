const { body, validationResult } = require('express-validator');

const mlValidator = {
    validatePredictionInput: [
        // Validate city (must not be empty and must match a valid city in the training data)
        body('city').not().isEmpty().withMessage('City is required'),
        
        // Validate price (must be numeric)
        body('price').isNumeric().withMessage('Price must be a number'),
        
        // Validate property_type (must not be empty and must match one of the property types in the training data)
        body('property_type').not().isEmpty().withMessage('Property type is required'),
        
        // Validate square_meter (must be numeric)
        body('square_meter').isNumeric().withMessage('Square meter must be a number'),
        
        // Validate bedrooms (must be numeric)
        body('bedrooms').isNumeric().withMessage('Bedrooms must be a number'),
        
        // Validate bathrooms (must be numeric)
        body('bathrooms').isNumeric().withMessage('Bathrooms must be a number'),
        
        // Validate living_rooms (must be numeric)
        body('living_rooms').isNumeric().withMessage('Living rooms must be a number'),
        
        // Validate balconies (must be numeric)
        body('balconies').isNumeric().withMessage('Balconies must be a number'),
        
        // Validate parking_spaces (must be numeric)
        body('parking_spaces').isNumeric().withMessage('Parking spaces must be a number'),
    ],
};

module.exports = mlValidator;
