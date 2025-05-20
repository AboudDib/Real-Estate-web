/**
 * UserProperties Component
 * ------------------------
 * This component fetches and displays a list of properties owned by the currently logged-in user.
 * 
 * Functionality:
 * - Retrieves the user ID from localStorage.
 * - Fetches properties associated with the user via PropertyService API call.
 * - Handles loading state with a spinner.
 * - Handles errors gracefully with error messages.
 * - Displays properties in a responsive Material-UI Grid using the PropertyCard component.
 * - Provides a fixed header with:
 *    - Company logo (loaded from imageLinks),
 *    - A button linking back to the dashboard,
 *    - A ListingButton component for adding new properties.
 * 
 * UI/UX Notes:
 * - The header is fixed at the top, with content padding to avoid overlap.
 * - Loading spinner is centered vertically below the header.
 * - Responsive layout adapts to different screen sizes using MUI Grid breakpoints.
 * - Error messages and empty states are clearly displayed.
 * 
 * Usage:
 * - Must have a logged-in user with user_id stored in localStorage.
 * - PropertyService.getPropertiesByUserId should return data in the format:
 *   { data: { properties: Array<Property> } }
 * 
 * Potential improvements:
 * - Refresh properties list automatically after adding a new listing.
 * - Improve responsiveness on very small screens.
 * - Validate and handle cases where user info is missing or malformed.
 */

import React, { useState, useEffect } from "react";
import PropertyService from "../services/PropertyService";
import PropertyCard from "../components/PropertyCard";
import {
  Grid,
  Button,
  Box,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import imageLinks from "../assets/ImageLinks";
import { Link } from "react-router-dom";
import ListingButton from "../components/listingButton"; // Import the ListingButton

const UserProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);

      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.user_id;

        if (!userId) {
          setError("User not found.");
          setLoading(false);
          return;
        }

        console.log("Fetching properties for user ID:", userId);

        const response = await PropertyService.getPropertiesByUserId(userId);

        console.log("API Response:", response);

        const props = response?.data?.properties;
        if (Array.isArray(props)) {
          setProperties(props);
        } else {
          setError("Failed to load properties. Please try again later.");
        }
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("Failed to load properties. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "100vh",
        width: "99vw",
        overflowX: "hidden",
        backgroundColor: "white",
      }}
    >
      {/* Outer Full Screen Box */}
      <Box
        sx={{
          height: "100%",
          width: "100%",
          bgcolor: "#f8f9fa",
          position: "relative",
        }}
      >
        {/* Logo Header */}
        <Paper
          elevation={3}
          sx={{
            p: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            width: "100%",
            zIndex: 1100,
            backgroundColor: "white",
          }}
        >
          {imageLinks?.BlackLRELogo ? (
            <img
              src={imageLinks.BlackLRELogo}
              alt="Logo"
              style={{ height: 60, marginRight: 16, marginLeft: 10 }}
            />
          ) : (
            <Typography variant="h6" color="error">
              Logo Not Found
            </Typography>
          )}

          {/* Back to Dashboard Button */}
         <Link to="/dashboard">
  <Button
    variant="contained"
   sx={{
  backgroundColor: "#9b87f5",
  "&:hover": {
    backgroundColor: "#8a74ef",
  },
  mr: 4,  // add margin-right on the *logo* to push the button leftwards
}}

  >
    Back to Dashboard
  </Button>
</Link>


          {/* Listing Button */}
          <ListingButton />
        </Paper>

        {/* Main Content */}
        <Box
          sx={{
            paddingTop: "100px", // Adjust this value to give enough space below the logo
            padding: "16px",
            marginTop: "70px", // Added margin to make sure content starts below the logo box
          }}
        >
          {error && (
            <Typography
              variant="h6"
              color="error"
              sx={{ textAlign: "center", mt: 5 }}
            >
              {error}
            </Typography>
          )}

          <Box
            sx={{
              maxWidth: "100%",
              minWidth: "90%",
              mx: "auto",
              padding: "16px",
            }}
          >
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "100vh",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={3}>
                {properties.length > 0 ? (
                  properties.map((property) => {
                    // Log the entire property object to inspect the structure
                    console.log("Sending property object:", property);

                    return (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                        key={property.property_id}
                        sx={{ minHeight: 400 }}
                      >
                        <PropertyCard
                          property={property}  // Passing the entire property object, including images
                        />
                      </Grid>
                    );
                  })
                ) : (
                  <Grid item xs={12}>
                    <Typography
                      variant="h6"
                      sx={{
                        textAlign: "center",
                        width: "100%",
                        mt: 5,
                        color: "red",
                      }}
                    >
                      No properties found.
                    </Typography>
                  </Grid>
                )}
              </Grid>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UserProperties;
