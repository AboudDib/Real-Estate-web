/**
 * AboutUsSection.jsx
 * 
 * A reusable React component that displays an "About Us" section with multiple info cards.
 * 
 * Features:
 * - Receives an array of card objects with `image`, `title`, and `description` props.
 * - Uses Material UI's Grid and Card components for responsive layout and styling.
 * - Cards are displayed in a responsive grid: full width on xs, two per row on sm, four per row on md+.
 * - Each card features an image, a bold title, and a descriptive paragraph.
 * - Styling includes padding, box shadows, rounded corners, and fixed card heights that adjust by screen size.
 * 
 * Usage:
 * Import and render <AboutUsSection cards={cardsArray} /> where cardsArray is an array of card data.
 */
 
// Outer container box for background and padding
// Grid container to hold cards with spacing and center alignment
// Loop over cards array to create each card
// Grid item for responsive sizing: full width xs, half sm, quarter md
// Card component with rounded corners, shadow, padding and min height
// CardContent with center text alignment
// Card image with fixed width and height, margin below
// Card title with bold typography
// Card description as body text

import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";

const AboutUsSection = ({ cards }) => {
  return (
    <Box
      sx={{
        backgroundColor: "white",
        padding: 4,
        textAlign: "center",
        color: "black",
      }}
    >
      {/* Card Grid */}
      <Grid container spacing={4} justifyContent="center">
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                borderRadius: "16px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                padding: 2,
                minHeight: {
                  xs: "240px",
                  sm: "280px", 
                  md: "320px",
                },
              }}
            >
              <CardContent sx={{ textAlign: "center" }}>
                <img
                  src={card.image}
                  alt={card.title}
                  style={{
                    width: "120px",
                    height: "120px",
                    marginBottom: "20px",
                  }}
                />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {card.title}
                </Typography>
                <Typography variant="body2">{card.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AboutUsSection;
