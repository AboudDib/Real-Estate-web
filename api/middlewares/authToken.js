/**
 * authenticateToken.js
 *
 * This middleware function is used to protect routes by verifying JWT tokens passed in the Authorization header.
 * It ensures that only authenticated users with a valid token can access the protected endpoints.
 *
 * How it works:
 * 1. It checks the `Authorization` header for a Bearer token.
 * 2. If the token is present, it attempts to verify it using the secret key defined in your `.env` file (JWT_SECRET).
 * 3. If verification succeeds, it attaches the decoded user information (e.g. userId, email) to `req.user`.
 * 4. If verification fails or if no token is provided, it returns a `401 Unauthorized` or `403 Forbidden` response.
 *
 * Usage:
 * Include this middleware in any route that requires user authentication.
 *
 * Example:
 * const authenticateToken = require('./middleware/authenticateToken');
 * router.get('/protected', authenticateToken, (req, res) => {
 *   res.json({ message: 'This is a protected route', user: req.user });
 * });
 *
 * Expected Header Format:
 * Authorization: Bearer <token>
 */

const jwt = require('jsonwebtoken');
require('dotenv').config();

// Authentication middleware
const authenticateToken = (req, res, next) => {
  // Get token from authorization header
  const authHeader = req.header('authorization');
  const token = authHeader && authHeader.split(' ')[1];  // Extract token from 'Bearer <token>'

  // If no token, return 401 Unauthorized
  if (!token) {
    return res.status(401).json({ status: 401, message: 'Unauthorized, token not found' });
  }

  // Verify the token
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);  // Verify the token using the secret key
    req.user = user;  // Attach the user object to the request
    next();  // Proceed to the next middleware or route handler
  } catch (err) {
    console.error('Error verifying token:', err);  // Log the error for debugging
    return res.status(403).json({ status: 403, message: 'Forbidden, invalid token' });
  }
};

module.exports = authenticateToken;
