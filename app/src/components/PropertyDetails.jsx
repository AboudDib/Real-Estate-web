/**
 * PropertyDetails Component
 * 
 * This component renders editable numeric input fields for key property attributes:
 * - Bedrooms
 * - Bathrooms
 * - Living rooms
 * - Balconies
 * - Parking spaces
 * - Year built
 * 
 * Each input is accompanied by a representative icon and styled inside a Paper component.
 * The component uses Material UI for layout and styling.
 * 
 * Props:
 * - formData (object): The current state of the form containing property attributes.
 * - handleChange (function): A callback function to handle changes to input fields.
 * 
 * Usage:
 * <PropertyDetails formData={formData} handleChange={handleChange} />
 * 
 * Dependencies:
 * - @mui/material: Box, TextField, Paper, Stack
 * - @mui/icons-material: Bed, Bathtub, Weekend, Balcony, DirectionsCar, CalendarToday
 */

import React from 'react';
import { Box, TextField, Paper, Stack } from '@mui/material';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import WeekendIcon from '@mui/icons-material/Weekend';
import BalconyIcon from '@mui/icons-material/Balcony';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const PropertyDetails = ({ formData, handleChange }) => {
  return (
    <Box sx={{ py: 1 }}>
      <Stack direction="row" spacing={2} flexWrap="wrap">
        <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', flex: '1 1 120px', minWidth: '120px' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <BedIcon color="action" />
            <TextField
              label="Bedrooms"
              id="bedrooms"
              type="number"
              value={formData.bedrooms}
              onChange={handleChange}
              variant="standard"
              fullWidth
              InputProps={{ disableUnderline: true }}
            />
          </Stack>
        </Paper>
        
        <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', flex: '1 1 120px', minWidth: '120px' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <BathtubIcon color="action" />
            <TextField
              label="Bathrooms"
              id="bathrooms"
              type="number"
              value={formData.bathrooms}
              onChange={handleChange}
              variant="standard"
              fullWidth
              InputProps={{ disableUnderline: true }}
            />
          </Stack>
        </Paper>
        
        <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', flex: '1 1 120px', minWidth: '120px' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <WeekendIcon color="action" />
            <TextField
              label="Living Rooms"
              id="living_rooms"
              type="number"
              value={formData.living_rooms}
              onChange={handleChange}
              variant="standard"
              fullWidth
              InputProps={{ disableUnderline: true }}
            />
          </Stack>
        </Paper>
      </Stack>

      <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mt: 2 }}>
        <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', flex: '1 1 120px', minWidth: '120px' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <BalconyIcon color="action" />
            <TextField
              label="Balconies"
              id="balconies"
              type="number"
              value={formData.balconies}
              onChange={handleChange}
              variant="standard"
              fullWidth
              InputProps={{ disableUnderline: true }}
            />
          </Stack>
        </Paper>

        <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', flex: '1 1 120px', minWidth: '120px' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <DirectionsCarIcon color="action" />
            <TextField
              label="Parking"
              id="parking_spaces"
              type="number"
              value={formData.parking_spaces}
              onChange={handleChange}
              variant="standard"
              fullWidth
              InputProps={{ disableUnderline: true }}
            />
          </Stack>
        </Paper>

        <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', flex: '1 1 120px', minWidth: '120px' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <CalendarTodayIcon color="action" />
            <TextField
              label="Year Built"
              id="year_built"
              type="number"
              value={formData.year_built}
              onChange={handleChange}
              variant="standard"
              fullWidth
              InputProps={{ disableUnderline: true }}
            />
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
};

export default PropertyDetails;
