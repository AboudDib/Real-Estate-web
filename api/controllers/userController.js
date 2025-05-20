/**
 * userController.js
 *
 * This controller handles user-related operations in the real estate web application.
 * It delegates business logic to the userService and ensures proper request validation,
 * response formatting, and error handling.
 *
 * Features:
 * - User authentication (login) with JWT token generation
 * - User registration
 * - Retrieve user by ID
 * - Update user information
 * - Delete user account
 *
 * Middleware:
 * - Uses express-validator to validate incoming request bodies and parameters
 *
 * External Services:
 * - JSON Web Token (JWT) for secure authentication
 * - Resend (commented/unused here) for potential email notifications (e.g., verification or password recovery)
 *
 * Routes Handled:
 * - POST /api/users/login → authenticateUser
 * - POST /api/users/register → registerUser
 * - GET /api/users/:userId → getUserById
 * - PUT /api/users/:userId → updateUser
 * - DELETE /api/users/:userId → deleteUser
 *
 * Notes:
 * - Password hashing and verification are assumed to be handled in userService.
 * - JWT secret key and expiration are configured via environment variables.
 * - Validation must be set in route definitions for `validationResult` to catch errors.
 */


const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const userService = require('../services/userService'); // Import userService
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

// Authenticate User (Login)
exports.authenticateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const user = await userService.authenticateUser(email, password); // Delegate to service

    // Generate a JWT token
    const token = jwt.sign({ userId: user.user_id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.status(200).json({
      message: 'Authentication successful',
      token: token, // Send the token to the client
      user: user     // Return the user object
    });
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed', error: error.message });
  }
};

// Register User
exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { first_name, last_name, email, password, phone_number } = req.body;
    const user = await userService.registerUser(first_name, last_name, email, password, phone_number);

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(400).json({ message: 'User creation failed', error: error.message });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { userId } = req.params;
    const { first_name, last_name, email, password, phone_number } = req.body;
    const user = await userService.updateUser(userId, first_name, last_name, email, password, phone_number); // Delegate to service
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(400).json({ message: 'User update failed', error: error.message });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await userService.deleteUser(userId); // Delegate to service
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'User deletion failed', error: error.message });
  }
};

// Get User by ID
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userService.getUserById(userId); // Delegate to service
    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ message: 'User not found', error: error.message });
  }
};
