/**
 * UserService
 * -----------
 * This service provides functions to interact with the backend API for user-related operations:
 * - User authentication (login)
 * - User registration (signup)
 * - Fetching user details by ID
 * - Updating user information
 * - Deleting a user account
 * 
 * For requests that require authorization, the JWT token stored in localStorage is included
 * in the request headers automatically.
 * 
 * All functions handle errors using a centralized API error handler for consistent error processing.
 */

import http from "../http-common"; // Make sure the HTTP client is set up to communicate with your API
import handleApiError from "../utils/apiErrorHandler";  

// Function to get the token
const getToken = () => {
  return localStorage.getItem("token");  // Assuming token is stored in localStorage
};

// Function to authenticate the user
const authenticate = async (user) => {
  try {
    const response = await http.post(`/users/login`, user);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

// Register a new user
const register = async (userData) => {
  try {
    const response = await http.post(`/users/register`, userData);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

// Function to update a user's information
const updateUser = async (userId, userData) => {
  try {
    const response = await http.put(`/users/update/${userId}`, userData);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

// Function to delete a user
const deleteUser = async (userId) => {
  try {
    const response = await http.delete(`/users/delete/${userId}`);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};
// Function to get a user by ID
const getUserById = async (userId) => {
  try {
    const token = getToken();  // Get the token from localStorage
    const response = await http.get(`/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,  // Include the token in the request header
      },
    });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};


// Export the functions as methods of the UserService object
const UserService = {
  authenticate,
  register,
  updateUser,
  deleteUser,
  getUserById,
};

export default UserService;
