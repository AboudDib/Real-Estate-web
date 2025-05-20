/**
 * PropertyApprovalCard Component
 * 
 * This component is used by administrators to review and moderate property listings.
 * It displays property details (images, name, price, location, and specifications)
 * and provides options to either approve or disapprove (delete) a listing.
 * 
 * Features:
 * - Responsive image carousel using react-responsive-carousel
 * - Approval and disapproval functionality using PropertyService
 * - Success dialog with visual feedback on approval/disapproval
 * - Refreshes parent property list on action (via `onRefresh` callback)
 * 
 * Props:
 * - property: Object containing property details to display
 * - onRefresh: Function to be called to refresh the list after an approval/disapproval
 * 
 */

import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Chip,
  Divider,
  Avatar,
  Dialog,
  DialogContent,
  DialogActions
} from "@mui/material";
import {
  Check,
  Bed,
  Bathtub,
  Straighten,
  DirectionsCar,
  Weekend,
  Balcony,
  Delete,
} from "@mui/icons-material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import PropertyService from "../services/PropertyService"; // Import PropertyService

const PropertyApprovalCard = ({ property, onRefresh }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [successAlert, setSuccessAlert] = useState({
    open: false,
    message: "",
    isApproval: true
  });

  const handleApprove = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("admin"));
      const userId = user?.user_id;
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        alert("Please log in again.");
        return;
      }

      await PropertyService.approveProperty(property.property_id, userId);
      // Show success dialog instead of alert
      setSuccessAlert({
        open: true,
        message: `Property "${property.name}" has been approved successfully!`,
        isApproval: true
      });
    } catch (error) {
      console.error("Error approving property:", error);
      alert("There was an error approving the property.");
    }
  };

  const handleDisapprove = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.user_id;
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        alert("Please log in again.");
        return;
      }

      await PropertyService.deleteProperty(property.property_id);
      // Show success dialog for disapproval instead of alert
      setSuccessAlert({
        open: true,
        message: `Property "${property.name}" has been disapproved and deleted successfully!`,
        isApproval: false
      });
    } catch (error) {
      console.error("Error disapproving property:", error);
      alert("There was an error disapproving the property.");
    }
  };

  // Function to close the alert and refresh the property list
  const handleCloseAlert = () => {
    setSuccessAlert({ ...successAlert, open: false });
    
    // Trigger the refresh function passed from parent component
    if (typeof onRefresh === 'function') {
      console.log("Triggering refresh function");
      onRefresh();
    } else {
      console.log("No refresh function provided or not a function");
      // Fallback to window reload if no refresh function is provided
      window.location.reload();
    }
  };

  return (
    <>
      {/* Success Alert Dialog */}
      <Dialog
        open={successAlert.open}
        onClose={handleCloseAlert}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            minWidth: { xs: "90%", sm: "450px" },
            maxWidth: "550px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          },
        }}
      >
        <DialogContent sx={{ pt: 4, pb: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: "50%",
                backgroundColor: successAlert.isApproval ? "#E5DEFF" : "#FFEBEE",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <Box
                component="span"
                sx={{ 
                  color: successAlert.isApproval ? "#6E59A5" : "#D32F2F", 
                  fontSize: "2rem", 
                  fontWeight: "bold" 
                }}
              >
                {successAlert.isApproval ? "✓" : "✗"}
              </Box>
            </Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom color="#1A1F2C">
              {successAlert.isApproval ? "Property Approved" : "Property Disapproved"}
            </Typography>
            <Typography variant="body1" color="#8E9196" sx={{ mt: 1 }}>
              {successAlert.message}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: "center" }}>
          <Button
            onClick={handleCloseAlert}
            variant="contained"
            sx={{
              backgroundColor: successAlert.isApproval ? "#9b87f5" : "#f44336",
              "&:hover": { backgroundColor: successAlert.isApproval ? "#7E69AB" : "#d32f2f" },
              px: 4,
              py: 1,
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: "bold",
              boxShadow: successAlert.isApproval 
                ? "0 4px 10px rgba(155, 135, 245, 0.3)" 
                : "0 4px 10px rgba(244, 67, 54, 0.3)",
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Card
        sx={{
          width: "96vw",
          margin: "15px -20px",
          borderRadius: "12px",
          boxShadow: "0 6px 16px rgba(0, 0, 0, 0.08)",
          overflow: "hidden",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          maxwidth: "96vw",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 12px 20px rgba(0, 0, 0, 0.12)",
          },
        }}
      >
        <Grid container>
          {/* Images Section with Carousel */}
          {property.images?.length > 0 && (
            <Grid item xs={12} md={5} sx={{ position: "relative" }}>
              <Box
                sx={{
                  height: "100%",
                  minHeight: { xs: "250px", md: "100%" },
                  position: "relative",
                  overflow: "hidden",
                  maxHeight: "40vh", // 40% of the viewport height
                  maxWidth: "40vw", // 40% of the viewport width
                }}
              >
                <Carousel
                  selectedItem={currentImageIndex}
                  onChange={setCurrentImageIndex}
                  infiniteLoop
                  showArrows
                  showThumbs={false}
                  autoPlay
                  interval={5000}
                  transitionTime={500}
                >
                  {property.images.map((image, index) => {
                    return (
                      <Box key={index}>
                        <Box
                          component="img"
                          src={image}
                          alt={property.name}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "center",
                            transition: "transform 0.5s ease",
                          }}
                        />
                      </Box>
                    );
                  })}
                </Carousel>
                <Chip
                  label={property.property_type}
                  sx={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    fontWeight: "bold",
                    fontSize: "0.75rem",
                  }}
                />
                <Chip
                  label={property.isForRent ? "For Rent" : "For Sale"}
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 46,
                    backgroundColor: property.isForRent ? "#9b87f5" : "#7E69AB",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "0.75rem",
                  }}
                />
              </Box>
            </Grid>
          )}

          {/* Info Section */}
          <Grid item xs={12} md={7}>
            <CardContent sx={{ padding: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 2,
                }}
              >
                <Box>
                  <Typography
                    variant="h5"
                    gutterBottom
                    fontWeight="bold"
                    color="#1A1F2C"
                  >
                    {property.name}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mb: 1,
                      display: "flex",
                      alignItems: "center",
                      color: "#8E9196",
                    }}
                  >
                    <Box component="span" sx={{ mr: 2 }}>
                      📍 {property.city}
                    </Box>
                    <Box
                      component="span"
                      sx={{ fontWeight: "bold", color: "#7E69AB" }}
                    >
                      ${property.price.toLocaleString()}
                    </Box>
                  </Typography>
                </Box>
                <Box>
                  <Button
                    variant="contained"
                    onClick={handleApprove}
                    startIcon={<Check />}
                    sx={{
                      backgroundColor: "#9b87f5",
                      "&:hover": {
                        backgroundColor: "#7E69AB",
                      },
                      borderRadius: "8px",
                      boxShadow: "0 4px 10px rgba(155, 135, 245, 0.3)",
                      mr: 1,
                    }}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleDisapprove}
                    startIcon={<Delete />}
                    sx={{
                      backgroundColor: "#f44336",
                      "&:hover": {
                        backgroundColor: "#d32f2f",
                      },
                      borderRadius: "8px",
                      boxShadow: "0 4px 10px rgba(244, 67, 54, 0.3)",
                    }}
                  >
                    Disapprove
                  </Button>
                </Box>
              </Box>

              <Typography
                variant="body2"
                sx={{
                  mb: 2,
                  color: "#555",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  textOverflow: "ellipsis",
                }}
              >
                {property.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              {/* Updated Grid for Property Features in a Single Row */}
              <Grid container spacing={2} justifyContent="space-between">
                <Grid item xs={2}>
                  <PropertyFeature
                    icon={<Bed />}
                    value={property.bedrooms}
                    label="Bedrooms"
                  />
                </Grid>
                <Grid item xs={2}>
                  <PropertyFeature
                    icon={<Bathtub />}
                    value={property.bathrooms}
                    label="Bathrooms"
                  />
                </Grid>
                <Grid item xs={2}>
                  <PropertyFeature
                    icon={<Weekend />}
                    value={property.living_rooms}
                    label="Living Rooms"
                  />
                </Grid>
                <Grid item xs={2}>
                  <PropertyFeature
                    icon={<DirectionsCar />}
                    value={property.parking_spaces}
                    label="Parking"
                  />
                </Grid>
                <Grid item xs={2}>
                  <PropertyFeature
                    icon={<Balcony />}
                    value={property.balconies}
                    label="Balconies"
                  />
                </Grid>
                <Grid item xs={2}>
                  <PropertyFeature
                    icon={<Straighten />}
                    value={`${property.square_meter} m²`}
                    label="Area"
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                <Chip
                  label={`Year: ${property.year_built}`}
                  size="small"
                  sx={{ backgroundColor: "#F1F0FB", color: "#6E59A5" }}
                />
                <Chip
                  label={property.furnished ? "Furnished" : "Not Furnished"}
                  size="small"
                  sx={{ backgroundColor: "#F1F0FB", color: "#6E59A5" }}
                />
              </Box>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </>
  );
};

// Helper component for property features
const PropertyFeature = ({ icon, value, label }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
    }}
  >
    <Avatar
      sx={{
        width: 40,
        height: 40,
        mb: 0.5,
        backgroundColor: "#E5DEFF",
        color: "#6E59A5",
      }}
    >
      {icon}
    </Avatar>
    <Typography variant="body2" fontWeight="bold" color="#403E43">
      {value}
    </Typography>
    <Typography variant="caption" color="#8E9196">
      {label}
    </Typography>
  </Box>
);

export default PropertyApprovalCard;