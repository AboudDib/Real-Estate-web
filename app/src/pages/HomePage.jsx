/*
  HomePage Component:

  - Imports React, Material UI components, and routing/linking utilities.
  - Imports custom AboutUsSection component and imageLinks asset collection.

  Functionality:
  - Defines an array `cardsData` containing information for three cards (Buy a home, Sell a home, Rent a home), each with an image, title, and description.
  
  Layout:
  1. Hero Section:
    - Full viewport height with a background image from `imageLinks.HomeBckg`.
    - Transparent AppBar positioned absolutely at the top, containing:
      - Logo image aligned left.
      - Navigation buttons on the right:
        * "About us" button that smoothly scrolls down to the About Us section.
        * "Contact Us" button linking to a WhatsApp chat.
        * A label showing "🇱🇧 Lebanon".
    - Centered hero content includes:
      * Main heading "The Future of Real Estate".
      * Subheading describing the platform’s purpose.
      * Buttons for "Login" and "Signup" linking to respective routes, styled responsively.

  2. About Us Section:
    - Placed below the hero section with minimum full viewport height.
    - White background with centered text content.
    - Title "About Us" with bold styling.
    - A descriptive paragraph about the mission.
    - Renders the `AboutUsSection` component with the `cardsData` passed as props to display feature cards.

  Styling:
  - Uses Material UI’s `sx` prop for responsive and consistent styling.
  - Buttons and typography adjust font sizes and layouts based on screen size.
  - Navigation bar is transparent to blend with the hero background.

  Overall:
  - A clean, modern landing page for a real estate platform.
  - Focus on intuitive navigation with smooth scrolling and external contact.
  - Responsive design with clear call-to-actions for login/signup.
*/

import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import AboutUsSection from "../components/AboutUsSection";
import imageLinks from "../assets/ImageLinks"; // Import image links

const HomePage = () => {
  const cardsData = [
    {
      image: imageLinks.BuyAHome,
      title: "Buy a home",
      description:
        "A real estate agent can provide you with a clear breakdown of costs so that you can avoid surprise expenses.",
    },
    {
      image: imageLinks.SellAHome,
      title: "Sell a home",
      description:
        "No matter what path you take to sell your home, we can help you navigate a successful sale.",
    },
    {
      image: imageLinks.RentAHome,
      title: "Rent a home",
      description:
        "We’re creating a seamless online experience – from shopping on the largest rental network, to applying, to paying rent.",
    },
    
  ];

  return (
    <>
      {/* Hero Section with Background */}
      <Box
        sx={{
          height: "100vh",
          backgroundImage: `url(${imageLinks.HomeBckg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "relative",
          color: "white",
        }}
      >
        {/* Navigation Bar */}
        <AppBar
          position="absolute"
          sx={{ background: "transparent", boxShadow: "none" }}
        >
          <Toolbar
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
              padding: { xs: "10px", sm: "16px", md: "20px" },
            }}
          >
            {/* Logo */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                position: "absolute",
                left: { xs: "2%", sm: "4%", md: "4%" },
                paddingRight: 2,
              }}
            >
              <img
                src={`${imageLinks.WhiteLRELogo}`}
                alt="Logo"
                style={{ width: "80px", height: "auto" }}
              />
            </Box>

            {/* Navigation Links */}
            <Box sx={{ display: "flex", gap: { xs: 1, sm: 2 }, alignItems: "center" }}>
            <ScrollLink
    to="aboutUsSection"
    smooth={true}
    duration={500}
    sx={{
      textDecoration: "none", // Remove underline
    }}
  >
    <Button color="inherit" sx={{ color: "white" }}>
      About us
    </Button>
  </ScrollLink>
 <Button
  color="inherit"
  component="a"
  href="https://wa.me/96171919306"
  target="_blank"
  rel="noopener noreferrer"
  sx={{
    color: "white", // White color for the "Contact Us" button
    "&:hover": {
      color: "white", // Ensure the text stays white on hover
    },
  }}
>
  Contact Us
</Button>


  <Typography sx={{ fontWeight: "bold", textTransform: "none" }}>
    🇱🇧 Lebanon
  </Typography>
</Box>

          </Toolbar>
        </AppBar>

        {/* Hero Content */}
        <Container
          sx={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            maxWidth: { xs: "90%", sm: "80%", md: "60%" },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              mb: 2,
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            }}
          >
            The Future of Real Estate
          </Typography>
          <Typography
            variant="body1"
            sx={{
              maxWidth: "100%",
              mb: 3,
              fontSize: { xs: "1rem", sm: "1.2rem" },
            }}
          >
            Our platform is open to everyone—buy, sell, and explore properties
            with ease. Whether you're a homeowner, investor, or buyer, we
            provide the tools to connect you directly with real estate
            opportunities.
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            <Link to="/login" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#fff",
                  color: "#000",
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                Login
              </Button>
            </Link>
            <Link to="/signup" style={{ textDecoration: "none" }}>
              <Button
                variant="outlined"
                sx={{
                  borderColor: "#fff",
                  color: "#fff",
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                Signup
              </Button>
            </Link>
          </Box>
        </Container>
      </Box>

      {/* About Us Section */}
      <Box
        id="aboutUsSection"
        sx={{
          minHeight: "100vh", // Ensure the section takes at least the height of the viewport
          padding: { xs: 2, sm: 4 },
          textAlign: "center",
          backgroundColor: "white", // Set background to white
          display: "flex",
          flexDirection: "column",
          justifyContent: "center", // Center the content vertically
          alignItems: "center",
        }}
      >
        {/* About Us Title */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            mb: 3,
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            color: "black", // Set the title text color to black
          }}
        >
          About Us
        </Typography>

        {/* About Us Description */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: "normal",
            maxWidth: "80%",
            margin: "0 auto",
            mb: 4,
            fontSize: { xs: "1rem", sm: "1.2rem" },
            color: "black", // Set the description text color to black
          }}
        >
          Our mission is to provide the best real estate opportunities and
          resources to make buying, selling, and renting easy and accessible for
          everyone.
        </Typography>

        {/* Cards Section */}
        <AboutUsSection cards={cardsData} />
      </Box>
    </>
  );
};

export default HomePage;
