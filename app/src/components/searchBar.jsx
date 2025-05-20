/**
 * SearchBar Component
 * 
 * A responsive search input component with a stylish design using Material UI and Lucide icons.
 * It allows users to type a city name and trigger a search using either the enter key or the search button.
 * 
 * Features:
 * - Controlled input (`localQuery`) for smooth UX and form isolation
 * - Two search icons: one static and one clickable for submission
 * - Responsive styling and hover effects for improved user interaction
 * 
 * Props:
 * - searchQuery (string): The current global search term from parent
 * - setSearchQuery (function): Callback to update the parent with the new query
 * 
 * Usage:
 * <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
 * 
 */

import React, { useState } from 'react';
import { Paper, InputBase, IconButton, Box } from '@mui/material';
import { Search } from 'lucide-react';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  const [localQuery, setLocalQuery] = useState(searchQuery || '');

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(localQuery);
  };

  const handleChange = (e) => {
    setLocalQuery(e.target.value);
  };

  return (
    <Box sx={{ width: '100%', mx: 2, mb: 3 }}>
      <Paper
        component="form"
        onSubmit={handleSearch}
        elevation={3}
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          borderRadius: '12px',
          backgroundColor: '#ffffff',
          transition: 'box-shadow 0.3s',
          '&:hover': {
            boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
          },
          width: 'calc(100% - 40px)',  // Ensures the Paper takes up the available width minus the margins
        }}
      >
        <IconButton sx={{ p: '10px', color: '#9b87f5' }} aria-label="search">
          <Search size={24} />
        </IconButton>
        <InputBase
          sx={{
            ml: 1,
            flex: 1,
            py: 1.5,
            fontSize: { xs: '0.875rem', sm: '1rem' },  // Responsive font size
            minWidth: '0', // Ensure the input resizes on smaller screens
          }}
          placeholder="Search by city"
          value={localQuery}
          onChange={handleChange}
          inputProps={{ 'aria-label': 'search properties' }}
        />
        <IconButton
          type="submit"
          sx={{
            p: '10px',
            mr: 1,
            bgcolor: '#9b87f5',
            color: 'white',
            borderRadius: '8px',
            '&:hover': {
              bgcolor: '#8a74ef',
            },
          }}
          aria-label="search"
        >
          <Search size={18} />
        </IconButton>
      </Paper>
    </Box>
  );
};

export default SearchBar;
