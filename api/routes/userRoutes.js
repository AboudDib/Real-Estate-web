const express = require('express');
const userController = require('../controllers/userController');
const userValidator = require('../validators/userValidator');
const { validate } = require('../middlewares/validationMiddleware');
const authToken = require('../middlewares/authToken');

const router = express.Router();
// Register User
router.post('/register', userValidator.registerValidator, validate, userController.registerUser);

// Login User
router.post('/login', userValidator.loginValidator, validate, userController.authenticateUser);

// Update User (requires token)
router.put('/update/:userId', authToken, userValidator.updateUserValidator, validate, userController.updateUser);

// Delete User (requires token)
router.delete('/delete/:userId', authToken, userController.deleteUser);

// Get User by ID (requires token)
router.get('/:userId', authToken, userController.getUserById);

module.exports = router;
