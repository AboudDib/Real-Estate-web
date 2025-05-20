/**
 * AdminPanel Component
 * --------------------
 * This component displays a centralized dashboard for admins to review and approve
 * pending property listings submitted by agents.
 *
 * Features:
 * - Fetches non-approved properties from the backend on mount and on refresh.
 * - Shows loading spinner while fetching data.
 * - Displays an error alert if the fetch fails.
 * - Lists all pending properties using the PropertyApprovalCard component.
 * - Shows a friendly message when no properties are pending approval.
 * - Includes a refresh button in the app bar to manually reload the list.
 *
 * UI/UX:
 * - Responsive layout with MUI components.
 * - Clean, modern design with clear visual hierarchy.
 * - Uses MUI's AppBar, Toolbar, Paper, Box, Typography, Alert, and CircularProgress.
 *
 * Props: None
 *
 * State:
 * - properties: array of pending property objects
 * - loading: boolean indicating data fetch in progress
 * - error: string containing any fetch error message
 *
 * External Dependencies:
 * - PropertyService.getNonApprovedProperties() to fetch data
 * - PropertyApprovalCard for rendering individual property approval UI
 */

import React, { useEffect, useState } from "react";
import {
  Typography,
  CircularProgress,
  Paper,
  Box,
  Alert,
  AlertTitle,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import { Refresh } from "@mui/icons-material";
import PropertyApprovalCard from "../components/PropertyApprovalCard";
import PropertyService from "../services/PropertyService";

const AdminPanel = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNonApproved = async () => {
    console.log("Fetching non-approved properties...");
    setLoading(true);
    try {
      const response = await PropertyService.getNonApprovedProperties();
      setProperties(response.data.properties);
      setError(null);
    } catch (err) {
      setError("Failed to fetch non-approved properties. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNonApproved();
  }, []);

  return (
    <Box
      sx={{
        width: "99vw",
        minHeight: "100vh",
        bgcolor: "#F6F6F7",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
      }}
    >
      {/* App Bar */}
      <AppBar position="static" sx={{ backgroundColor: "#9b87f5", boxShadow: 2 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            Property Approval Central
          </Typography>
          <IconButton
            color="inherit"
            onClick={fetchNonApproved}
            sx={{
              backgroundColor: "rgba(255,255,255,0.1)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
            }}
          >
            <Refresh />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          py: { xs: 2, md: 4 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Header Panel */}
        <Paper
          elevation={0}
          sx={{
            width: "99%",
            maxWidth: "1440px",
            p: { xs: 2, sm: 3 },
            mb: 4,
            borderRadius: 2,
            backgroundColor: "white",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h4" fontWeight="bold" color="#1A1F2C">
              Pending Property Approvals
            </Typography>
            <Box
              sx={{
                backgroundColor: "#E5DEFF",
                color: "#6E59A5",
                px: 2,
                py: 1,
                borderRadius: "20px",
                fontWeight: "bold",
              }}
            >
              {properties.length} Properties
            </Box>
          </Box>
          <Typography variant="body1" color="#8E9196">
            Review and approve new property listings submitted by agents
          </Typography>
        </Paper>

        {/* Error Message */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              width: "100%",
              maxWidth: "1440px",
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "40vh" }}>
            <CircularProgress sx={{ color: "#9b87f5" }} />
          </Box>
        ) : (
          <Box
            sx={{
              width: "100%",
              maxWidth: "1440px",
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              px: { xs: 2, md: 0 },
            }}
          >
            {properties.length === 0 ? (
              <Paper
                sx={{
                  p: 4,
                  textAlign: "center",
                  borderRadius: 2,
                  backgroundColor: "white",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  mt: 8,
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    backgroundColor: "#F1F0FB",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                    mx: "auto",
                  }}
                >
                  <Box component="span" sx={{ fontSize: "2rem" }}>
                    ✓
                  </Box>
                </Box>
                <Typography variant="h6" gutterBottom>
                  No Properties Pending Approval
                </Typography>
                <Typography variant="body2" color="#8E9196">
                  All submitted properties have been reviewed
                </Typography>
              </Paper>
            ) : (
              properties.map((property) => (
                <PropertyApprovalCard
                  key={property.property_id || `${property.name}-${property.city}`}
                  property={property}
                  onRefresh={fetchNonApproved}
                />
              ))
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AdminPanel;