
/**
 * ListingType Component
 * 
 * This component displays a group of checkboxes for setting the listing type
 * and features of a real estate property. It includes options for:
 * - For Rent
 * - For Sale
 * - Furnished
 * 
 * Key Features:
 * - Controlled checkboxes that reflect and update `formData` state.
 * - Uses `handleCheckboxChange` callback to manage checkbox toggles.
 * - Uses Material UI (MUI) components for consistent design:
 *   - Paper for bordered containers.
 *   - Stack for responsive layout with spacing.
 *   - FormControlLabel with Checkbox and Typography for labeled checkboxes.
 * - Highlights selected options by increasing the label font weight.
 * 
 * Props:
 * - formData: Object containing the current values of isForRent, isForSale, and furnished.
 * - handleCheckboxChange: Function to handle changes in checkbox state.
 * 
 * Usage:
 * - Intended to be used inside a listing form to let users specify
 *   whether the property is for rent/sale and whether it's furnished.
 */

import React from 'react';
import { Paper, Stack, FormControlLabel, Checkbox, Typography,Box } from '@mui/material';

const ListingType = ({ formData, handleCheckboxChange }) => {
  return (
    <Box sx={{ py: 1 }}>
      <Stack direction="row" spacing={2} flexWrap="wrap">
        {/* For Rent Checkbox */}
        <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', flex: '1 1 120px', minWidth: '120px' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <FormControlLabel
              control={
                <Checkbox
                  name="isForRent"
                  checked={formData.isForRent}
                  onChange={handleCheckboxChange}
                  sx={{
                    color: '#9b87f5',
                    '&.Mui-checked': {
                      color: '#9b87f5',
                    },
                  }}
                />
              }
              label={
                <Typography variant="body1" fontWeight={formData.isForRent ? 600 : 400}>
                  For Rent
                </Typography>
              }
            />
          </Stack>
        </Paper>

        {/* For Sale Checkbox */}
        <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', flex: '1 1 120px', minWidth: '120px' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <FormControlLabel
              control={
                <Checkbox
                  name="isForSale"
                  checked={formData.isForSale}
                  onChange={handleCheckboxChange}
                  sx={{
                    color: '#9b87f5',
                    '&.Mui-checked': {
                      color: '#9b87f5',
                    },
                  }}
                />
              }
              label={
                <Typography variant="body1" fontWeight={formData.isForSale ? 600 : 400}>
                  For Sale
                </Typography>
              }
            />
          </Stack>
        </Paper>

        {/* Furnished Checkbox */}
        <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', flex: '1 1 120px', minWidth: '120px' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <FormControlLabel
              control={
                <Checkbox
                  name="furnished"
                  checked={formData.furnished}
                  onChange={handleCheckboxChange}
                  sx={{
                    color: '#9b87f5',
                    '&.Mui-checked': {
                      color: '#9b87f5',
                    },
                  }}
                />
              }
              label={
                <Typography variant="body1" fontWeight={formData.furnished ? 600 : 400}>
                  Furnished
                </Typography>
              }
            />
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
};

export default ListingType;
