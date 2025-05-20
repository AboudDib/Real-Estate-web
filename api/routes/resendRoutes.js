// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const resendController = require('../controllers/resendController'); // Import the resendController

// Route for sending the verification code
router.post('/send-code', resendController.sendVerificationCode);

module.exports = router;
