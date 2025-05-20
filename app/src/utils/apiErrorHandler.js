// utils/apiErrorHandler.js

// Helper function to handle API errors
const handleApiError = (error) => {
    if (error.response) {
      // If the backend returns a response with an error
      console.error("API Error: ", error.response.data); // Log the error details for debugging
      return { status: error.response.status, data: error.response.data };
    } else {
      // Handle network errors or other issues without response
      console.error("Network Error: ", error.message);
      return { status: 500, data: { message: "Network error" } };
    }
  };
  
  export default handleApiError;
  