/*
  This React component manages and displays detailed information about a selected property,
  including an image gallery with navigation, seller contact options, AI inquiry, and 360-view features.

  Key functionalities include:
  - useEffect hook:
    * Sets global body styles for full viewport display.
    * Retrieves and parses the selected property from localStorage.
    * Redirects to the home page if no valid property is found.
    * Fetches seller information asynchronously using the property's user_id.
    * Cleans up body styles on component unmount.

  - Image gallery navigation:
    * goToNext() and goToPrevious() update the current displayed image index, looping around the images array.

  - User interactions:
    * handleAskAI() opens a popup for AI-based property inquiries.
    * handle360View() navigates to a 360-degree view page for the property.
    * handleContactWhatsApp() opens WhatsApp chat with the seller using a pre-filled message.
    * handleContactEmail() opens the default email client with a pre-filled inquiry email.

  - Property deletion:
    * handleDelete() deletes the selected property by calling an API service.
    * Includes error handling, token validation, and cleanup of localStorage.
    * Navigates back before performing deletion.

  - Conditional rendering:
    * Shows a loading spinner if property images are missing or empty.
    * Displays the property information, image gallery with navigation buttons, back button, and interactive controls.
    * Includes a delete button if the user has permission.

  - Layout uses Material-UI components (Box, Button, Paper, Typography, Grid, Stack) for responsive design.
  - The component ensures full-screen display with controlled overflow and styling.

  Notes:
  - The code relies on external services (UserService, PropertyService) and components (PredictionPopup).
  - The component expects `navigate` (from react-router) and various state setters to be declared outside this snippet.
  - Local storage keys and API response structures must be consistent with usage here.
*/

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Bed,
  Bath,
  Ruler,
  Calendar,
  Brain,
  MessageSquare,
  Mail,
  Home,
} from "lucide-react";

// MUI imports
import {
  Button,
  Card,
  Typography,
  IconButton,
  Box,
  Container,
  Grid,
  Paper,
  Chip,
  Divider,
  CircularProgress,
  Stack,
} from "@mui/material";
import UserService from "../services/UserService";
import PredictionPopup from "../components/PredictionPopup";
import PropertyService from "../services/PropertyService";

const PropertyDetails = () => {
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [predictionPopup, OpenPredictionPopup] = useState(false);
  const [seller, setSeller] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const selectedProperty = JSON.parse(localStorage.getItem("selectedProperty"));
  const canDelete = user?.user_id === selectedProperty?.user_id;

  useEffect(() => {
    // Force the body to be full width/height with no overflow
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "auto";
    document.body.style.width = "100vw";
    document.body.style.minWidth = "100vw";
    document.body.style.minHeight = "100vh";

    const storedProperty = localStorage.getItem("selectedProperty");
    if (!storedProperty) {
      navigate("/");
      return;
    }
    try {
      const parsed = JSON.parse(storedProperty);
      console.log("Property object from localStorage:", parsed);
      setProperty(parsed);
    } catch (err) {
      console.error("Invalid JSON in localStorage:", err);
      navigate("/");
    }

    const fetchSellerInfo = async () => {
      // Get property from localStorage first
      const storedProperty = localStorage.getItem("selectedProperty");
      const userproperty = storedProperty ? JSON.parse(storedProperty) : null;

      console.log("Property from localStorage:", userproperty);

      if (userproperty?.user_id) {
        try {
          const response = await UserService.getUserById(userproperty.user_id);
          console.log("API Response:", response);

          if (response && response.data) {
            setSeller(response.data.user);

            console.log("Seller Info:", response.data);
          }
        } catch (error) {
          console.error("Error fetching seller information:", error);
        }
      } else {
        console.warn("No valid user_id found in property");
      }
    };

    fetchSellerInfo();

    // Cleanup function to reset styles
    return () => {
      document.body.style.margin = "";
      document.body.style.padding = "";
      document.body.style.overflow = "";
      document.body.style.width = "";
      document.body.style.minWidth = "";
      document.body.style.minHeight = "";
    };
  }, [navigate]);
const handleDelete = async () => {
  console.log("Selected Property ID:", selectedProperty?.property_id);
  console.log("Selected Property:", selectedProperty);

  if (!selectedProperty || !selectedProperty.property_id) {
    console.error("Property ID is missing.");
    console.log("Property ID (from selectedProperty):", selectedProperty?.property_id);
    return; // Prevent deletion if there's no property ID
  }

  // Log the token before the delete request
  const token = localStorage.getItem("token");
  console.log("Token before deletion:", token);

  // Navigate back to the previous page before making the delete request
  navigate(-1);

  try {
    console.log("Deleting property with ID:", selectedProperty._id);

    // Perform the delete operation
    const response = await PropertyService.deleteProperty(selectedProperty.property_id);
    console.log("Delete successful:", response);

    // Log the token after the deletion
    const tokenAfterDelete = localStorage.getItem("token");
    console.log("Token after deletion:", tokenAfterDelete);

    // Optional: Handle response status if necessary
    if (response.status === 401 || response.status === 403) {
      console.log("Unauthorized or Forbidden, redirecting to login...");
      navigate("/login"); // Redirect to login if token expired or unauthorized
      return;
    }

    // Remove selected property from localStorage
    localStorage.removeItem("selectedProperty");
    console.log("Selected property removed from localStorage.");

  } catch (error) {
    console.error("Error deleting property:", error);

    if (error.response) {
      console.error("Server responded with:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request setup error:", error.message);
    }

    // Optional: Handle other error states, e.g., notify the user
    alert("An error occurred while deleting the property. Please try again later.");
  }
};



  const goToNext = () => {
    if (property?.images?.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % property.images.length);
    }
  };

  const goToPrevious = () => {
    if (property?.images?.length > 0) {
      setCurrentIndex(
        (prevIndex) =>
          (prevIndex - 1 + property.images.length) % property.images.length
      );
    }
  };

  const handleAskAI = () => {
    OpenPredictionPopup(true); // Open the PredictionPopup
  };

  const handlePredictionClose = () => {
    OpenPredictionPopup(false); // Close the popup when the user clicks "Close"
  };

  const handle360View = () => {
    navigate(`/properties/${property.property_id}/360-view`);
  };

  const handleContactWhatsApp = () => {
    const phoneNumber = seller?.phone_number || "5551234567";
    const message = `Hello, I'm interested in the property "${
      property.name
    }" listed for $${property.price?.toLocaleString()}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleContactEmail = () => {
    const email = seller?.email || "agent@example.com";
    const subject = `Inquiry about property: ${property.name}`;
    const body = `Hello,\n\nI'm interested in learning more about the property "${
      property.name
    }" listed for $${property.price?.toLocaleString()}.\n\nPlease contact me with additional information.\n\nThank you!`;
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  if (!property || !property.images || property.images.length === 0) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        width="100vw"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: "#ffffff",
          margin: 0,
          padding: 0,
        }}
      >
        <CircularProgress style={{ color: "#9b87f5" }} size={60} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: "#ffffff",
        height: "100vh",
        width: "100vw",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 0,
        padding: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
      }}
    >
      {/* Hero Section with Image Gallery */}
      <Box
        sx={{
          position: "relative",
          height: "70vh",
          minHeight: "70vh",
          width: "100%",
          minWidth: "100%",
          bgcolor: "#000000",
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src={property.images[currentIndex]}
          alt={`Property view ${currentIndex + 1}`}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            opacity: 0.9,
          }}
        />

        {/* Navigation controls */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: { xs: 2, sm: 4 },
          }}
        >
          <IconButton
            onClick={goToPrevious}
            sx={{
              bgcolor: "rgba(0,0,0,0.6)",
              color: "#ffffff",
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.8)",
              },
              width: { xs: 40, sm: 56 },
              height: { xs: 40, sm: 56 },
            }}
          >
            <ChevronLeft
              sx={{ width: { xs: 24, sm: 30 }, height: { xs: 24, sm: 30 } }}
            />
          </IconButton>

          <IconButton
            onClick={goToNext}
            sx={{
              bgcolor: "rgba(0,0,0,0.6)",
              color: "#ffffff",
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.8)",
              },
              width: { xs: 40, sm: 56 },
              height: { xs: 40, sm: 56 },
            }}
          >
            <ChevronRight
              sx={{ width: { xs: 24, sm: 30 }, height: { xs: 24, sm: 30 } }}
            />
          </IconButton>
        </Box>

        {/* Image counter */}
        <Box
          sx={{
            position: "absolute",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              bgcolor: "rgba(0,0,0,0.5)",
              color: "#ffffff",
              px: 3,
              py: 1,
              borderRadius: 5,
              fontWeight: 500,
            }}
          >
            {currentIndex + 1} / {property.images.length}
          </Paper>
        </Box>

        {/* Back button */}
        <Box
          sx={{
            position: "absolute",
            top: 24,
            left: 24,
          }}
        >
          <Button
            onClick={() => {
              // Clear selected property from local storage
              localStorage.removeItem("selectedProperty"); // Adjust the key to match your localStorage key
              navigate(-1);
            }}
            variant="contained"
            startIcon={<ChevronLeft />}
            sx={{
              bgcolor: "rgba(255,255,255,0.9)",
              color: "#333",
              fontWeight: 600,
              "&:hover": {
                bgcolor: "#ffffff",
              },
              boxShadow: 2,
            }}
          >
            Back
          </Button>
        </Box>

        {/* Interactive buttons */}
        <Box
          sx={{
            position: "absolute",
            top: 24,
            right: 24,
            display: "flex",
            gap: 2,
          }}
        >
          <Button
            onClick={handleAskAI}
            variant="contained"
            startIcon={<MessageSquare />}
            sx={{
              bgcolor: "rgba(255,255,255,0.9)",
              color: "#333",
              fontWeight: 600,
              "&:hover": {
                bgcolor: "#ffffff",
              },
              boxShadow: 2,
              display: { xs: "none", sm: "flex" },
            }}
          >
            Ask AI
          </Button>
          <PredictionPopup
            open={predictionPopup}
            handleClose={handlePredictionClose}
          />

          <Button
            onClick={handle360View}
            variant="contained"
            startIcon={<Calendar />}
            sx={{
              bgcolor: "rgba(255,255,255,0.9)",
              color: "#333",
              fontWeight: 600,
              "&:hover": {
                bgcolor: "#ffffff",
              },
              boxShadow: 2,
            }}
          >
            View in 360
          </Button>

          {canDelete && (
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md"
            >
              Delete Property
            </button>
          )}
        </Box>
      </Box>

      {/* Main content */}
      <Container
        maxWidth="xl"
        sx={{
          mt: -8,
          mb: 8,
          position: "relative",
          zIndex: 1,
          px: { xs: 2, sm: 3, md: 4 },
          width: "100%",
          marginTop: "2%",
        }}
      >
        <Grid container spacing={4}>
          {/* Left column: Property details */}
          <Grid item xs={12} lg={8}>
            <Stack spacing={4}>
              {/* Property title and price card */}
              <Paper
                elevation={3}
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  p: { xs: 2, sm: 3, md: 4 },
                  width: "95%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 2, sm: 0 },
                  }}
                >
                  <Box>
                    <Typography
                      variant="h3"
                      component="h1"
                      sx={{
                        fontWeight: 700,
                        mb: 1,
                        fontSize: {
                          xs: "1.75rem",
                          sm: "2.25rem",
                          md: "2.5rem",
                        },
                      }}
                    >
                      {property.name}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <MapPin
                        size={18}
                        style={{ color: "#9b87f5", marginRight: 8 }}
                      />
                      <Typography variant="subtitle1" color="text.secondary">
                        {property.city}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: { xs: 2, sm: 3 },
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Home
                            size={24}
                            style={{ color: "#9b87f5", marginRight: 8 }}
                          />
                          <Typography>{property.property_type}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Ruler
                            size={24}
                            style={{ color: "#9b87f5", marginRight: 8 }}
                          />
                          <Typography>{property.square_meter} m²</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Chip
                    label={`$${
                      property.price?.toLocaleString() || "Contact for price"
                    }`}
                    sx={{
                      bgcolor: "#9b87f5",
                      color: "white",
                      fontWeight: 700,
                      fontSize: { xs: "0.9rem", sm: "1.1rem" },
                      py: 2.5,
                      px: 1,
                      alignSelf: { xs: "flex-start", sm: "flex-start" },
                    }}
                  />
                </Box>
              </Paper>

              {/* Property description */}
              <Paper
                elevation={2}
                sx={{
                  borderRadius: 2,
                  p: { xs: 2, sm: 3, md: 4 },
                  width: "95%",
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                  About This Property
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ lineHeight: 1.8 }}
                >
                  {property.description ||
                    "No description available for this property."}
                </Typography>
              </Paper>

              {/* Property features and details */}
              <Paper
                elevation={2}
                sx={{
                  borderRadius: 2,
                  p: { xs: 2, sm: 3, md: 4 },
                  width: "95%",
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                  Property Details
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={6} md={4}>
                    <Box>
                      <Typography color="text.secondary" variant="body2">
                        Living Rooms
                      </Typography>
                      <Typography fontWeight={500}>
                        {property.living_rooms || "Residential"}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <Box>
                      <Typography color="text.secondary" variant="body2">
                        Year Built
                      </Typography>
                      <Typography fontWeight={500}>
                        {property.year_built || "N/A"}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <Box>
                      <Typography color="text.secondary" variant="body2">
                        Balconies
                      </Typography>
                      <Typography fontWeight={500}>
                        {property.balconies}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <Box>
                      <Typography color="text.secondary" variant="body2">
                        Bedrooms
                      </Typography>
                      <Typography fontWeight={500}>
                        {property.bedrooms}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <Box>
                      <Typography color="text.secondary" variant="body2">
                        Bathrooms
                      </Typography>
                      <Typography fontWeight={500}>
                        {property.bathrooms}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <Box>
                      <Typography color="text.secondary" variant="body2">
                        Parking
                      </Typography>
                      <Typography fontWeight={500}>
                        {property.parking_spaces || "Available"}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Stack>
          </Grid>
          {/* Right column: Seller contact */}
          <Grid item xs={12} lg={4} sx={{ pl: { lg: 4 } }}>
            <Stack spacing={4}>
              <Paper
                elevation={3}
                sx={{
                  borderRadius: 2,
                  p: { xs: 2, sm: 3, md: 4 },
                  width: "80%",
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                  Contact seller
                </Typography>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}
                >
                  {seller && console.log("Seller inside JSX:", seller.user_id)}
                  {seller && (
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {`${seller.first_name} ${seller.last_name}`}
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Stack spacing={2} sx={{ mb: 4 }}>
                  {seller && (
                    <>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          borderColor: "rgba(0,0,0,0.08)",
                        }}
                      >
                        <Mail size={20} style={{ color: "#9b87f5" }} />
                        <Typography
                          noWrap
                          sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                        >
                          {seller.email}
                        </Typography>
                      </Paper>

                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          borderColor: "rgba(0,0,0,0.08)",
                        }}
                      >
                        <MessageSquare size={20} style={{ color: "#9b87f5" }} />
                        <Typography>{seller.phone_number}</Typography>
                      </Paper>
                    </>
                  )}
                </Stack>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      onClick={handleContactWhatsApp}
                      variant="contained"
                      startIcon={
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"></path>
                          <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1zm0 0a5 5 0 0 0 5 5m0-5a5 5 0 0 0-5-5"></path>
                        </svg>
                      }
                      sx={{
                        bgcolor: "#25D366",
                        fontWeight: 600,
                        py: 1.5,
                        "&:hover": {
                          bgcolor: "#128C7E",
                        },
                      }}
                    >
                      WhatsApp
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      onClick={handleContactEmail}
                      variant="contained"
                      startIcon={<Mail />}
                      sx={{
                        bgcolor: "#9b87f5",
                        fontWeight: 600,
                        py: 1.5,
                        "&:hover": {
                          bgcolor: "#7a68c3",
                        },
                      }}
                    >
                      Email
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default PropertyDetails;
