/**
 * PredictionPopup Component
 * --------------------------
 * This component displays a dialog popup that shows a price prediction 
 * (or estimated rent) for a selected property based on input data and 
 * an ML model prediction.
 * 
 * Key Features:
 * - Fetches selected property data from localStorage.
 * - Sends the property data to the ML service to receive a predicted price.
 * - Compares the predicted price with the listed price and categorizes it as:
 *   "Underpriced", "Fairly Priced", or "Overpriced" with color indicators.
 * - Displays a detailed property summary and a visual price comparison scale.
 * 
 * Props:
 * - open (Boolean): Controls whether the dialog is open.
 * - handleClose (Function): Callback to close the dialog.
 * 
 */

import React, { useEffect, useState } from "react";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Box, 
  Typography, 
  CircularProgress, 
  Paper, 
  Grid, 
  Chip, 
  Divider, 
  Alert
} from "@mui/material";
import { 
  ArrowUpward as ArrowUpIcon, 
  ArrowDownward as ArrowDownIcon, 
  CheckCircle as CheckCircleIcon, 
  Info as InfoIcon 
} from "@mui/icons-material";
import MlService from "../services/MlService";

const PredictionPopup = ({ open, handleClose }) => {
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [listedPrice, setListedPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [property, setProperty] = useState(null);
  const [priceComparison, setPriceComparison] = useState(null);

  const getPropertyData = () => {
    try {
      const data = localStorage.getItem("selectedProperty");
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error("Failed to parse property data:", err);
      return null;
    }
  };

  const buildInputData = (property) => ({
    city: property.city,
    square_meter: property.square_meter,
    property_type: property.property_type,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    living_rooms: property.living_rooms,
    balconies: property.balconies,
    parking_spaces: property.parking_spaces,
    price: parseFloat(property.price),

  });

  const calculateComparison = (listed, predicted) => {
    const diff = listed - predicted;
    const percentage = Math.round((Math.abs(diff) / predicted) * 100);
    
    let status = "";
    let color = "";
    
    if (diff > 0) {
      status = percentage < 5 ? "Fairly Priced" : "Overpriced";
      if (percentage < 5) color = "#4caf50"; // green
      else if (percentage < 15) color = "#ff9800"; // orange
      else color = "#f44336"; // red
    } else {
      status = percentage < 5 ? "Fairly Priced" : "Underpriced";
      if (percentage < 5) color = "#4caf50"; // green
      else if (percentage < 15) color = "#2196f3"; // blue
      else color = "#9c27b0"; // purple
    }
    
    setPriceComparison({ percentage, status, color });
  };

  const fetchPrediction = async () => {
    const propertyData = getPropertyData();
    if (!propertyData) {
      setError("No property data found in localStorage.");
      return;
    }

    setProperty(propertyData);
    setListedPrice(propertyData.price);
    setLoading(true);
    setError(null);

    try {
      const inputData = buildInputData(propertyData);
      const response = await MlService.getPrediction(inputData);
      
      if (response && response.predicted_price) {
        let adjusted = response.predicted_price;
        if (propertyData.isForRent) {
          adjusted *= 0.005; // Convert to estimated monthly rent
        }
        setPredictedPrice(adjusted);
        calculateComparison(propertyData.price, adjusted);
      } else {
        setError("Invalid response from prediction API.");
      }
    } catch (err) {
      setError("Failed to fetch predicted price.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchPrediction();
    } else {
      // Reset state when dialog closes
      setPredictedPrice(null);
      setListedPrice(null);
      setError(null);
      setPriceComparison(null);
    }
  }, [open]);

  const getPropertyLabel = () => {
    return property?.isForRent ? "Predicted Monthly Rent" : "Predicted Price";
  };

  // Calculate position of price marker (between 0-100%)
  const getMarkerPosition = () => {
    if (!predictedPrice || !listedPrice) return 50;
    const ratio = listedPrice / predictedPrice;
    return Math.max(0, Math.min(100, ratio * 50));
  };

  // Format currency values
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.5rem' }}>
        Property Price Prediction
      </DialogTitle>
      
      <Divider />
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
            <CircularProgress size={40} />
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              Analyzing property details...
            </Typography>
          </Box>
        ) : (
          <>
            {predictedPrice !== null && listedPrice !== null && (
              <Box sx={{ mt: 2 }}>
                {/* Property summary */}
                {property && (
                 <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: '#f5f9ff' }}>
  <Grid container spacing={2}>
    <Grid item xs={4}>
      <Typography variant="caption" color="text.secondary">Type</Typography>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {property.property_type}
      </Typography>
    </Grid>
    <Grid item xs={4}>
      <Typography variant="caption" color="text.secondary">Area</Typography>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {property.square_meter}m²
      </Typography>
    </Grid>
    <Grid item xs={4}>
      <Typography variant="caption" color="text.secondary">City</Typography>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {property.city}
      </Typography>
    </Grid>
    <Grid item xs={4}>
      <Typography variant="caption" color="text.secondary">Bedrooms</Typography>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {property.bedrooms}
      </Typography>
    </Grid>
    <Grid item xs={4}>
      <Typography variant="caption" color="text.secondary">Bathrooms</Typography>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {property.bathrooms}
      </Typography>
    </Grid>
    <Grid item xs={4}>
      <Typography variant="caption" color="text.secondary">Living Rooms</Typography>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {property.living_rooms}
      </Typography>
    </Grid>
    <Grid item xs={4}>
      <Typography variant="caption" color="text.secondary">Balconies</Typography>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {property.balconies}
      </Typography>
    </Grid>
    <Grid item xs={4}>
      <Typography variant="caption" color="text.secondary">Parking Spaces</Typography>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {property.parking_spaces}
      </Typography>
    </Grid>
    {property.isForRent !== undefined && (
      <Grid item xs={4}>
        <Typography variant="caption" color="text.secondary">Listing Type</Typography>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {property.isForRent ? "For Rent" : "For Sale"}
        </Typography>
      </Grid>
    )}
  </Grid>
</Paper>

                )}

                {/* Price comparison */}
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    mb: 3, 
                    borderRadius: 2,
                    background: 'linear-gradient(to bottom right, #ffffff, #f8f9fa)'
                  }}
                >
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={6} sx={{ textAlign: 'center' }}>
                      <Typography variant="subtitle2" color="text.secondary">Listed Price</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>
                        {formatCurrency(listedPrice)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: 'center' }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        {getPropertyLabel()}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>
                        {formatCurrency(predictedPrice)}
                      </Typography>
                    </Grid>
                  </Grid>
                  
                  {priceComparison && (
                    <Box sx={{ mt: 3 }}>
                      <Box sx={{ position: 'relative', height: 40, mb: 2 }}>
                        {/* Prediction Scale bar */}
                        <Box sx={{
                          position: 'absolute',
                          top: '50%',
                          left: 0,
                          width: '100%',
                          height: '4px',
                          bgcolor: '#e0e0e0',
                          borderRadius: '2px'
                        }} />
                        
                        {/* Predicted price marker (center) */}
                        <Box sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '2px',
                          height: '16px',
                          bgcolor: '#2196f3'
                        }} />
                        <Box sx={{
                          position: 'absolute',
                          top: '100%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          fontSize: '0.75rem',
                          color: 'text.secondary'
                        }}>
                          Predicted
                        </Box>
                        
                        {/* Listed price marker */}
                        <Box sx={{
                          position: 'absolute',
                          top: '50%',
                          left: `${getMarkerPosition()}%`,
                          transform: 'translateY(-50%)',
                          width: '2px',
                          height: '12px',
                          bgcolor: '#f44336'
                        }} />
                      </Box>
                      
                      <Box 
                        sx={{ 
                          textAlign: 'center', 
                          color: priceComparison.color, 
                          mt: 3 
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {priceComparison.status === "Overpriced" ? (
                            <ArrowUpIcon sx={{ mr: 0.5 }} />
                          ) : priceComparison.status === "Underpriced" ? (
                            <ArrowDownIcon sx={{ mr: 0.5 }} />
                          ) : (
                            <CheckCircleIcon sx={{ mr: 0.5 }} />
                          )}
                          
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {priceComparison.status} by {priceComparison.percentage}%
                          </Typography>
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {priceComparison.status === "Fairly Priced" 
                            ? "This property is priced according to its market value."
                            : priceComparison.status === "Overpriced" 
                              ? "This property is priced higher than its estimated market value."
                              : "This property is priced lower than its estimated market value."}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Paper>

                <Alert 
                  severity="info" 
                  icon={<InfoIcon fontSize="inherit" />}
                  sx={{ mb: 2 }}
                >
                  This prediction is based on comparable properties in the area and current market conditions.
                </Alert>
              </Box>
            )}
          </>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button 
          variant="outlined" 
          onClick={handleClose}
        >
          Close
        </Button>
        <Button 
          variant="contained" 
          onClick={fetchPrediction} 
          disabled={loading}
          color="primary"
        >
          {loading ? "Loading..." : "Recalculate"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PredictionPopup;
