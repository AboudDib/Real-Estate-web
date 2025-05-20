/**
 * PropertyCard Component
 * 
 * This component displays a styled card for a single real estate property.
 * It shows an image, price, title, location, and basic details such as
 * number of bedrooms and bathrooms. The card is clickable and navigates
 * to the property details page while saving the selected property to localStorage.
 * 
 * Props:
 * - property (object): The property data object containing:
 *   - name: string (optional) - The name/title of the property
 *   - price: number - The price of the property
 *   - city: string - The location/city of the property
 *   - bedrooms: number - Number of bedrooms
 *   - bathrooms: number - Number of bathrooms
 *   - isForRent: boolean - Whether the property is for rent or sale
 *   - images: string[] - Array of image URLs
 * 
 * Usage:
 * <PropertyCard property={propertyData} />
 * 
 */

import React from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box,
  Chip,
  Divider
} from '@mui/material';
import { Bed, Bath, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // Save the property object to localStorage
    localStorage.setItem("selectedProperty", JSON.stringify(property));

    // Navigate to the property details page
    navigate("/property-details");
  };

  const title = property.name || 'Property';
  const price = property.price || 0;
  const location = property.city || 'Location not specified';
  const beds = property.bedrooms || 0;
  const baths = property.bathrooms || 0;
  const listingType = property.isForRent ? 'rent' : 'sale';
  const imageUrl = property.images.length > 0 ? property.images[0] : '/placeholder.svg';

  return (
    <Card 
      onClick={handleCardClick}
      sx={{ 
        height: '100%',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
          cursor: 'pointer',
        },
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="220"
          image={imageUrl}
          alt={title}
          sx={{ 
            objectFit: 'cover',
            filter: 'brightness(1.03)'
          }}
        />
        <Chip 
          label={listingType === 'rent' ? 'For Rent' : 'For Sale'}
          sx={{ 
            position: 'absolute', 
            top: 16, 
            right: 16,
            bgcolor: listingType === 'rent' ? '#9b87f5' : '#F97316',
            color: 'white',
            fontWeight: '600',
            fontSize: '0.75rem',
            py: 0.5,
            px: 0.75,
            borderRadius: '6px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
          }}
        />
      </Box>
      
      <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" fontWeight="700" sx={{ mb: 1, fontSize: '1.3rem', color: '#333' }}>
          ${parseFloat(price).toLocaleString()}
          {listingType === 'rent' && <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: '#666' }}>/month</span>}
        </Typography>
        
        <Typography variant="subtitle1" sx={{ 
          fontWeight: 600, 
          mb: 1.5,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          lineHeight: '1.3',
          height: '2.6em',
          color: '#222'
        }}>
          {title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ 
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          mb: 2,
          color: '#666'
        }}>
          <MapPin size={14} style={{ color: '#9b87f5' }} />
          {location}
        </Typography>
        
        <Divider sx={{ my: 1.5 }} />
        
        <Box sx={{ 
          display: 'flex',
          pt: 1.5,
          color: '#555',
          mt: 'auto'
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            mr: 3
          }}>
            <Bed size={16} style={{ marginRight: '5px', color: '#9b87f5' }} />
            <Typography variant="body2" fontWeight={500}>{beds} {beds === 1 ? 'Bed' : 'Beds'}</Typography>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            mr: 3
          }}>
            <Bath size={16} style={{ marginRight: '5px', color: '#9b87f5' }} />
            <Typography variant="body2" fontWeight={500}>{baths} {baths === 1 ? 'Bath' : 'Baths'}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
