/**
 * MlService
 * ---------
 * This service handles communication with the backend ML prediction API.
 * 
 * Features:
 * - Sends input data to the '/ml/predict' endpoint via POST request.
 * - Attaches authorization token from localStorage if available.
 * - Logs outgoing request data and incoming response for debugging.
 * - Catches and processes any API errors through a centralized error handler.
 * 
 * Usage:
 * - Call getPrediction(inputData) with the relevant data object to receive a prediction result.
 * - The inputData shape depends on your backend ML model requirements.
 * - The service expects a token in localStorage under the key 'token' for authorization.
 * 
 * Notes:
 * - Ensure the backend endpoint '/ml/predict' is correctly set up to receive and process prediction requests.
 * - Modify getToken() if token storage method or authorization scheme changes.
 * 
 */

import http from "../http-common";  // Assuming the HTTP client is set up
import handleApiError from "../utils/apiErrorHandler";  // Error handling utility

// Function to get the token (if needed for authorization)
const getToken = () => {
  return localStorage.getItem("token");  // Assuming token is stored in localStorage
};

// Function to handle the ML prediction request
const getPrediction = async (inputData) => {
  try {
    const token = getToken();  // Get the token from localStorage (if required)

    // Log the request data to inspect what's being sent
    console.log("Sending prediction request with data:", inputData);

    const response = await http.post('/ml/predict', inputData, {
      headers: {
        Authorization: `Bearer ${token}`,  // Include the token in the request header (if needed)
      }
    });

    // Log the response data to see if the server returned any issues
    console.log("Prediction response received:", response.data);

    return response.data;  // Return the prediction result
  } catch (error) {
    // Log the error if any occurs
    console.error("Error during prediction request:", error);
    return handleApiError(error);  // Handle any errors that occur
  }
};

// Export the methods to use them in your components or other parts of the app
const MlService = {
  getPrediction,
};

export default MlService;
