/**
 * Property360ViewerPage Component
 *
 * This component provides an immersive 360-degree image viewer for a given property.
 *
 * Key Features:
 * - Fetches 360° image URLs (property models) associated with a property ID from backend via PropertyModelService.
 * - Displays images in a rotating 3D sphere using React Three Fiber and Three.js.
 * - Allows navigation between multiple 360° images using next/previous buttons and keyboard arrow keys.
 * - Supports closing the viewer via an "X" button or pressing Escape.
 * - Shows navigation instructions on initial load with an option to dismiss.
 * - Displays a loading spinner while fetching data and appropriate error messages if fetch fails or no images are available.
 * - Implements keyboard controls for navigation (Left/Right arrows), closing (Escape), and dismissing instructions (Enter/Space).
 * - Uses MUI components (Box, Typography, IconButton) and Material icons for UI elements.
 * - OrbitControls enable user interaction with the 3D scene (click-and-drag rotate, mouse wheel zoom).
 *
 * Implementation Details:
 * - Uses React hooks (useState, useEffect) for state management and side effects.
 * - `useParams` obtains the property ID from the URL parameters.
 * - `useNavigate` allows programmatic navigation for closing the viewer.
 * - The 3D sphere maps the current 360° image texture onto an inverted sphere to simulate immersive environment.
 * - Navigation buttons and keyboard controls update the displayed image and image counter.
 * - Error and loading states are handled gracefully with user feedback.
 *
 * Dependencies:
 * - React Three Fiber and Drei (OrbitControls) for 3D rendering and controls.
 * - Three.js for texture loading and 3D objects.
 * - Material UI (MUI) for styled UI components.
 * - Lucide-react and Material Icons for icons.
 * - PropertyModelService to fetch property model data.
 */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Canvas, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import PropertyModelService from "../services/PropertyModelService";
import { OrbitControls } from "@react-three/drei";
import { X } from "lucide-react";
import { Box, Typography, IconButton } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material"; // Importing stylish arrow icons
import { AlertTriangle } from "react-feather";

const Property360ViewerPage = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [imageCounter, setImageCounter] = useState("");
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        setError("");

        if (!propertyId) {
          setError("Property ID is missing");
          setIsLoading(false);
          return;
        }

        const response =
          await PropertyModelService.getPropertyModelsByPropertyId(propertyId);
        const propertyModels = response.data.propertyModels || [];

        if (propertyModels.length === 0) {
          setError("No 360° images available for this property.");
          setIsLoading(false);
          return;
        }

        const imageUrls = propertyModels
          .map((model) => model.model_url)
          .filter(Boolean);
        if (imageUrls.length === 0) {
          setError("No valid 360° image URLs found.");
          setIsLoading(false);
          return;
        }

        const formattedImages = imageUrls.map((url) => ({ model_url: url }));
        setImages(formattedImages);
        setImageCounter(`1/${imageUrls.length}`);
      } catch (err) {
        console.error("Error fetching 360° images:", err);
        setError(`Failed to load 360° images: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [propertyId]);

  const handleNext = () => {
    if (images.length <= 1) return;
    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIndex);
    setImageCounter(`${nextIndex + 1}/${images.length}`);
  };

  const handlePrev = () => {
    if (images.length <= 1) return;
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(prevIndex);
    setImageCounter(`${prevIndex + 1}/${images.length}`);
  };

  const handleClose = () => {
    navigate(-1);
  };

  const handleKeydown = (event) => {
    switch (event.key) {
      case "ArrowRight":
        handleNext();
        break;
      case "ArrowLeft":
        handlePrev();
        break;
      case "Escape":
        handleClose();
        break;
      case "Enter":
      case " ":
        setShowInstructions(false);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [currentIndex, images.length]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-t-white border-white/30 rounded-full animate-spin mb-6"></div>
        <div className="text-white text-xl font-light tracking-wider">
          Loading Immersive View
          <span className="animate-pulse">...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="fixed inset-0 bg-gradient-to-br from-[#1A1F2C] to-black flex flex-col items-center justify-center text-center p-4"
        style={{ marginLeft: "40vw" }}
      >
        <div className="w-full max-w-md px-8 py-10 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#9b87f5] to-[#6E59A5] flex items-center justify-center">
              <AlertTriangle size={42} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              No Images Available
            </h2>
            <p className="text-[#D6BCFA] mb-6">{error}</p>
            <button
              onClick={handleClose}
              className="bg-gradient-to-r from-[#9b87f5]/80 to-[#6E59A5]/80 hover:from-[#9b87f5] hover:to-[#6E59A5] text-white px-6 py-3 rounded-full transition-all duration-300 shadow-lg flex items-center gap-2 mx-auto"
            >
              <X size={20} />
              Close Viewer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden">
      {showInstructions && (
        <Box
          sx={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#F3F6FD",
            borderRadius: 2,
            boxShadow: 3,
            p: 3,
            zIndex: 999,
            textAlign: "center",
            minWidth: 300,
          }}
        >
          <Box
            sx={{
              width: 70,
              height: 70,
              borderRadius: "50%",
              backgroundColor: "#E5DEFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2,
            }}
          >
            <Box
              component="span"
              sx={{
                color: "#6E59A5",
                fontSize: "2rem",
                fontWeight: "bold",
              }}
            >
              i
            </Box>
          </Box>
          <Typography
            variant="h6"
            fontWeight="bold"
            color="#1A1F2C"
            gutterBottom
          >
            Navigation Tips
          </Typography>
          <Typography variant="body2" color="#8E9196">
            Use <strong>Left Click</strong> and drag to navigate.
            <br />
            Use the <strong>Mouse Wheel</strong> to zoom in and out.
            <br />
            Press <strong>Escape</strong> to exit the viewer.
          </Typography>

          {/* Close Button with X */}
          <IconButton
            onClick={() => setShowInstructions(false)}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              color: "#6E59A5",
              backgroundColor: "#F3F6FD",
              "&:hover": { backgroundColor: "#E5DEFF" },
            }}
          >
            <X size={24} />
          </IconButton>
        </Box>
      )}
      {/* Image Navigation Counter */}
      <Box
        sx={{
          position: "absolute",
          top: 10, // Move the counter to the absolute top of the screen
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#F3F6FD",
          borderRadius: 2,
          boxShadow: 3,
          p: 1, // Smaller padding for a smaller counter
          zIndex: 999,
          textAlign: "center",
          minWidth: 100, // Smaller width
        }}
      >
        <Typography variant="body2" fontWeight="bold" color="#6E59A5">
          {" "}
          {/* Purple color */}
          {`${currentIndex + 1}/${images.length}`}{" "}
          {/* Counter for current image */}
        </Typography>
      </Box>
      {/* Navigation Buttons */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          zIndex: 1000,
        }}
      >
        <button
          onClick={handlePrev}
          className="bg-white text-purple-500 text-2xl py-2 px-4 border border-purple-500 rounded-full backdrop-blur-md hover:bg-purple-500 hover:text-white hover:border-purple-500 transition-all"
        >
          <ArrowBackIos sx={{ fontSize: 20, color: "#6E59A5" }} />{" "}
          {/* Left Arrow */}
        </button>
        <button
          onClick={handleNext}
          className="bg-white text-purple-500 text-2xl py-2 px-4 border border-purple-500 rounded-full backdrop-blur-md hover:bg-purple-500 hover:text-white hover:border-purple-500 transition-all"
        >
          <ArrowForwardIos sx={{ fontSize: 20, color: "#6E59A5" }} />{" "}
          {/* Right Arrow */}
        </button>
      </Box>
      {/* 3D Canvas */}
      <Canvas
        style={{ width: "100vw", height: "100vh" }}
        camera={{ position: [0, 0, 0.1], fov: 75 }}
      >
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 15, 10]} angle={0.15} penumbra={1} />
        <OrbitControls
          enableZoom
          enablePan={false}
          minDistance={2}
          maxDistance={10}
          rotateSpeed={1}
        />
        <React360Image url={images[currentIndex].model_url} />
      </Canvas>
    </div>
  );
};

const React360Image = ({ url }) => {
  const texture = useLoader(THREE.TextureLoader, url);
  return (
    <mesh scale={[10, 10, 10]} rotation={[0, Math.PI, 0]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
    </mesh>
  );
};

export default Property360ViewerPage;
