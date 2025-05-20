const express = require('express');
const MlController = require('../controllers/mlController');
const mlValidator = require('../validators/mlValidator');
const router = express.Router();

// Handle the prediction request
router.post('/predict', mlValidator.validatePredictionInput, MlController.predict);

module.exports = router;
