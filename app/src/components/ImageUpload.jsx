/**
 * ImageUpload.jsx
 * 
 * A React component for uploading multiple images with preview and removal capabilities.
 * 
 * Features:
 * - Upload button styled with Material UI that accepts multiple image files.
 * - Displays count of uploaded images once images exist.
 * - Shows image previews in a responsive grid layout with square aspect ratio.
 * - Each preview has a remove button (styled as a small "×") in the top-right corner.
 * - Uses MUI Button, Paper, Typography, and Box components for consistent styling.
 * - Custom hover styles on upload button and remove buttons.
 * 
 * Props:
 * - images: Array of image objects with a `preview` URL property for displaying thumbnails.
 * - onUpload: Handler function called when new images are selected via file input.
 * - onRemove: Handler function called with index to remove an image from the list.
 * 
 * Usage:
 * Import and render <ImageUpload images={images} onUpload={handleUpload} onRemove={handleRemove} />
 * where `images` is an array of objects representing selected images with previews.
 */
 
// Upload Button wrapped with label for hidden file input
// File input accepts multiple images, triggers onUpload on change
// Conditional rendering: if images array length > 0, show preview section
// Preview container with light purple background and padding
// Display count of uploaded images
// Responsive grid to show image thumbnails
// Each image preview in a Paper component with relative positioning and square aspect ratio
// Image tag positioned absolutely to fill the container with cover fit
// Remove button positioned top-right with small circle style and hover effect

import React from 'react';
import { Button, Paper, Typography, Box } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';

const ImageUpload = ({ images, onUpload, onRemove }) => {
  return (
    <>
      <Button
        variant="outlined"
        component="label"
        fullWidth
        startIcon={<ImageIcon />}
        sx={{ 
          mt: 2, 
          p: 1.5,
          borderColor: '#9b87f5',
          color: '#9b87f5',
          '&:hover': {
            borderColor: '#7e22ce',
            backgroundColor: 'rgba(147, 51, 234, 0.05)',
          }
        }}
      >
        Upload Pictures
        <input
          type="file"
          multiple
          hidden
          onChange={onUpload}
          accept="image/*"
        />
      </Button>
      
      {images.length > 0 && (
        <Paper elevation={0} sx={{ mt: 2, p: 2, backgroundColor: 'rgba(147, 51, 234, 0.05)', borderRadius: 2 }}>
          <Typography variant="subtitle2" color="#9b87f5" gutterBottom>
            Uploaded Images: {images.length}
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
            gap: 1,
            mt: 2
          }}>
            {images.map((image, index) => (
              <Paper
                key={index}
                sx={{
                  position: 'relative',
                  paddingTop: '100%',
                  overflow: 'hidden',
                  borderRadius: 1,
                }}
              >
                <Box
                  component="img"
                  src={image.preview}
                  alt={`Preview ${index + 1}`}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <Button
                  onClick={() => onRemove(index)}
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    minWidth: '24px',
                    width: '24px',
                    height: '24px',
                    p: 0,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    },
                  }}
                >
                  ×
                </Button>
              </Paper>
            ))}
          </Box>
        </Paper>
      )}
    </>
  );
};

export default ImageUpload;
