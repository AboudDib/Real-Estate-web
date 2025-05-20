/*
  Dashboard Component: Displays a list of properties with filtering, sorting, and search capabilities.

  - Imports React hooks and Material UI components for UI and state management.
  - Imports custom services and components like PropertyService, PropertyCard, SearchBar, and ListingButton.
  - Uses React state hooks to manage property data, filters (category, type, price range, furnished, year built), search query, sorting options, loading state, and error handling.
  - Retrieves the current logged-in user from localStorage to include in requests.
  
  useEffect Hook:
    - Fetches property data whenever any of the filters or sorting options change.
    - Constructs a dynamic request body including rent/sale category, property type, price range, furnished status, year built range, search city, and user ID.
    - Sends the request using PropertyService.getPropertiesDynamic.
    - Updates state with the retrieved properties or error message.
    - Manages loading spinner state during the fetch.

  Another useEffect Hook:
    - Resets the price range when category (Sale or Rental) changes to sensible defaults.

  Render:
    - Layout consists of a full page box with a fixed top Paper component containing the logo and filters for category (Rental/Sale) and property type (Apartment/Villa).
    - Below, a SearchBar for city search.
    - Sorting controls to sort by price or date, ascending or descending.
    - A collapsible "More Filters" section to filter by price range slider, furnished status dropdown, and year built range inputs.
    - Shows an error message if loading properties fails.
    - Displays a loading spinner while fetching properties.
    - Shows a grid of PropertyCard components for each property or a "No properties found" message if empty.
    - A fixed button at the bottom right links to the user's own properties page.

  Styling:
    - Uses Material UI's sx prop for responsive and styled layout.
    - Color theme includes purple hues for buttons and sliders.
    - Responsive grid layout for property cards.
  
  Overall:
    - Provides a dynamic, filterable, and sortable dashboard for browsing properties with smooth UI feedback and user-specific filtering.
*/


import React, { useState, useEffect } from "react";
import PropertyService from "../services/PropertyService"; // Import the PropertyService
import PropertyCard from "../components/PropertyCard";
import {
  Grid,
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
  Paper,
  Collapse,
  Slider,
  TextField,
  CircularProgress, // Added for loading spinner
} from "@mui/material";
import imageLinks from "../assets/ImageLinks"; // Import image links
import SearchBar from "../components/searchBar"; // Import the SearchBar component
import ListingButton from "../components/listingButton"; // Adjust path if needed
import { Link } from "react-router-dom";


const Dashboard = () => {
  const [properties, setProperties] = useState([]);
  const [category, setCategory] = useState("Sale");
  const [type, setType] = useState("Apartment");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newly-listed");
  const [sortOrder, setSortOrder] = useState("asc");
  const [priceRange, setPriceRange] = useState([0, 2000000]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [furnished, setFurnished] = useState(false);
  const [minYear, setMinYear] = useState(1900);
  const [maxYear, setMaxYear] = useState(new Date().getFullYear());
  const user = JSON.parse(localStorage.getItem("user"));



  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
  
      // Ensure the sortBy value is set correctly as either "price" or "date"
      let sortParam = "";
      if (sortBy === "price") {
        sortParam = `price_${sortOrder}`; // Example: price_asc, price_desc
      } else if (sortBy === "newly-listed") {
        sortParam = `date_${sortOrder}`; // Example: date_asc, date_desc
      }
      console.log(localStorage);

      // Construct the request body based on filters
      const requestBody = {
        isRent: category === "Rental",
        sortBy: sortParam,
        propertyType: type === "Apartment" ? "apartment" : "villa",
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        furnished,
        minYear: minYear,
        maxYear: maxYear,
        user_id: user?.user_id, // Get user_id from the user object in localStorage
      
      };
      
      if (searchQuery.trim()) {
        requestBody.city = searchQuery;
      }
  
      // Log the requestBody to check the parameters being sent
      console.log("Request Body:", requestBody);
  
      try {
        // Send the request with the dynamic parameters
        const response = await PropertyService.getPropertiesDynamic(
          requestBody
        );
        console.log("Response data from PropertyService:", response);
  
        if (Array.isArray(response)) {
          setProperties(response);
        } else {
          setError("Failed to load properties. Please try again later.");
        }
      } catch (error) {
        setError("Failed to load properties. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchProperties();
  }, [category, type, searchQuery, sortBy, sortOrder, priceRange, furnished, minYear, maxYear]); // Add these to the dependencies
  
  useEffect(() => {
    // Reset price range when category changes
    if (category === "Rental") {
      setPriceRange([0, 5000]); // Reset to default for Rental
    } else {
      setPriceRange([0, 2000000]); // Reset to default for Sale
    }
  }, [category]); // Effect runs when category changes

  
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
        {/* Box containing Logo and Buttons */}
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
          <Box sx={{ display: "flex", gap: 2 }}>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              size="small"
            >
              <MenuItem value="Rental">Rental</MenuItem>
              <MenuItem value="Sale">Sale</MenuItem>
            </Select>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value)}
              size="small"
              sx={{ marginRight: 5 }}
            >
              <MenuItem value="Apartment">Apartment</MenuItem>
              <MenuItem value="Villa">Villa</MenuItem>
            </Select>
          </Box>
        </Paper>

        {/* Main content area, below the logo and buttons */}
        <Box sx={{ paddingTop: "100px", padding: "16px" }}>
          {/* Search Bar */}
          <Box sx={{ marginTop: "70px", padding: 0, width: "100%" }}>
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </Box>

          {/* Sorting & Filters */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              variant="outlined"
              onClick={() => setShowFilters(!showFilters)}
              sx={{
                borderColor: "#9b87f5",
                color: "#9b87f5",
                borderRadius: "8px",
                marginTop: "-10px",
                marginLeft: 2,
                fontSize: { xs: "0.75rem", sm: "1rem" },
                padding: { xs: "4px 8px", sm: "6px 12px" },
                "&:hover": {
                  borderColor: "#8a74ef",
                  bgcolor: "rgba(155, 135, 245, 0.04)",
                },
              }}
            >
              More Filters
            </Button>
            <Box sx={{ marginTop: "-10px", display: "flex", gap: 2 }}>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                size="small"
                sx={{ minWidth: 70 }}
              >
                <MenuItem value="price">Price</MenuItem>
                <MenuItem value="newly-listed">Date</MenuItem>
              </Select>
              <Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                size="small"
                sx={{ minWidth: 120, marginRight: 2 }}
              >
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </Box>
          </Box>

          {/* More Filters Section */}
          <Collapse in={showFilters}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                mb: 4,
                borderRadius: "12px",
                bgcolor: "white",
                transition: "max-height 0.3s ease-out",
                maxHeight: showFilters ? "400px" : "0",
                overflow: "hidden",
                marginTop: "20px",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="600"
                sx={{ mb: 2, color: "#333" }}
              >
                Price Range
              </Typography>
              <Slider
                value={priceRange}
                onChange={(e, newValue) => setPriceRange(newValue)}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `$${value.toLocaleString()}`}
                min={0} // Min price is 0 for both cases
                max={category === "Rental" ? 5000 : 2000000} // Max price is 5k for Rental, 2 million for Sale
                step={100} // Step size for better precision
                sx={{ mb: 3, color: "#9b87f5" }}
              />
              <Box
                sx={{ display: "flex", justifyContent: "space-between", px: 3 }}
              >
                <Typography
                  variant="body1"
                  fontWeight="500"
                  color="text.secondary"
                >
                  ${priceRange[0].toLocaleString()}
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight="500"
                  color="text.secondary"
                >
                  ${priceRange[1].toLocaleString()}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {/* Furnished Filter */}
                <Box sx={{ minWidth: 150 }}>
                  <Typography variant="h6" fontWeight="600" sx={{ mb: 1 }}>
                    Furnished
                  </Typography>
                  <Select
                    value={furnished ? "yes" : "no"}
                    onChange={(e) => setFurnished(e.target.value === "yes")}
                    size="small"
                    sx={{ width: "100%" }}
                  >
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </Select>
                </Box>

                {/* Year Built Range */}
                <Box sx={{ minWidth: 150 }}>
                  <Typography variant="h6" fontWeight="600" sx={{ mb: 1 }}>
                    Year Built Range
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <TextField
                      label="Min Year"
                      type="number"
                      size="small"
                      value={minYear}
                      onChange={(e) => setMinYear(Number(e.target.value))}
                      inputProps={{ min: 1800, max: new Date().getFullYear() }}
                      sx={{ width: 100 }}
                    />
                    <TextField
                      label="Max Year"
                      type="number"
                      size="small"
                      value={maxYear}
                      onChange={(e) => setMaxYear(Number(e.target.value))}
                      inputProps={{ min: 1800, max: new Date().getFullYear() }}
                      sx={{ width: 100 }}
                    />
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Collapse>

          {/* Error Message */}
          {error && (
            <Typography
              variant="h6"
              color="error"
              sx={{ textAlign: "center", mt: 5 }}
            >
              {error}
            </Typography>
          )}

          {/* Properties Grid */}
          <Box
            sx={{
              maxWidth: "100%",
              minWidth: "90%",
              mx: "auto",
              padding: "16px",
            }}
          >
            {/* Show loading spinner if properties are still loading */}
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
              <Grid container spacing={3} sx={{ minHeight: "auto" }}>
                {properties.length > 0 ? (
                  properties.map((property) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      key={property.property_id}
                      sx={{ minHeight: 400 }}
                    >
                      <PropertyCard property={property} />
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12} sx={{ minHeight: 400 }}>
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
      <Link to="/user-properties">
  <Button
    variant="contained"
    sx={{
      position: "fixed",
      bottom: 24,
      right: 45,
      zIndex: 1200,
      backgroundColor: "#9b87f5", // Light purple background
      "&:hover": {
        backgroundColor: "#8a74ef", // Slightly darker purple on hover
      },
    }}
  >
    See My Properties
  </Button>
</Link>
    </Box>
  );
};

export default Dashboard;
