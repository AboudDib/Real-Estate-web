  /**
 * ListingButton Component
 * 
 * This component renders a floating action button (FAB) that, when clicked,
 * opens a dialog for creating a new real estate property listing.
 * 
 * Key Features:
 * - Manages form state for property details (name, description, city, price, etc.).
 * - Handles form input changes and checkbox toggles (e.g., isForSale, isForRent, furnished).
 * - Validates that all required fields are filled before submission.
 * - Uploads property images to imgbb.com via their API and stores image URLs in state.
 * - Submits the property data to the backend API with user authentication.
 * - On successful creation, uploads associated images to the backend service.
 * - Shows API validation errors if the backend responds with errors.
 * - Opens a secondary dialog for additional image uploads after property creation.
 * - Allows removal of uploaded images from the form state.
 * 
 * External Dependencies:
 * - axios: for HTTP requests to imgbb image upload API.
 * - Material UI components for UI elements (Dialog, TextField, Buttons, etc.).
 * - PropertyService and PropertyImageService for backend interactions.
 * 
 * Environment:
 * - Uses a VITE environment variable for the imgbb API key.
 * 
 * Usage:
 * - Designed for integration into a real estate web application where users can create
 *   and upload new property listings along with images.
 */

  import React, { useState } from "react";
  import axios from "axios";
  import {
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    MenuItem,
    IconButton,
    Fab,
    Autocomplete,
    Typography,
    Box,
    Paper,
    Divider,
    InputAdornment,
  } from "@mui/material";
  import AddIcon from "@mui/icons-material/Add";
  import HomeIcon from "@mui/icons-material/Home";
  import LocationOnIcon from "@mui/icons-material/LocationOn";
  import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
  import SquareFootIcon from "@mui/icons-material/SquareFoot";
  import PropertyDetails from "./PropertyDetails";
  import ListingType from "./ListingType";
  import ImageUpload from "./ImageUpload";
  import PropertyService from "../services/PropertyService";
  import PropertyImageService from "../services/PropertyImageService"; // Import PropertyImageService
  import ImageUploadDialog from './VRImageUploadDialog';  // Adjust the import path based on your file structure


  const cities = [
    "Beirut",
    "Tripoli",
    "Saida",
    "Zahle",
    "Batroun",
    "Tyre",
    "Jounieh",
    "Aley",
    "Chouf",
    "Baabda",
    "Kesrouan",
    "Baalbek",
    "Hermel",
    "Nabatieh",
    "Marjayoun",
    "Zgharta",
    "Koura",
    "Rashaya",
    "Bint Jbeil",
    "Halba",
    "Akkar",
    "Khaldeh",
    "Bcharre",
    "Berdawni",
    "Damour",
    "Sour",
    "Mechref",
    "Mar Mikhael",
    "Achrafieh",
    "Chabrouh",
    "Mtayleb",
    "Kfardebian",
    "Dhour el Choueir",
    "Broumana",
    "Jal el Dib",
    "Beit Mery",
    "Zouk Mikael",
    "Jisr El Basha",
    "Kfarshima",
    "Sin El Fil",
    "Ain el Remmaneh",
  ];
  const apiKey = import.meta.env.VITE_IMGBB_API_KEY;

  const ListingButton = () => {
    const [open, setOpen] = useState(false);
    const [apiErrors, setApiErrors] = useState({});
    const [imageUploadDialogOpen, setImageUploadDialogOpen] = useState(false);
      const [propertyId, setPropertyId] = useState(null); // New state for propertyId
    const [formData, setFormData] = useState({
      name: "",
      description: "",
      city: "",
      price: "",
      property_type: "",
      square_meter: "",
      bedrooms: "",
      bathrooms: "",
      living_rooms: "",
      balconies: "",
      parking_spaces: "",
      isForRent: false,
      isForSale: true,
      year_built: "",
      furnished: false,
      images: [],
    });

    const handleChange = (e) => {
      const { id, value } = e.target;
      console.log(`Updating ${id} to ${value}`); // Add this log to check what's being updated
      setFormData((prevState) => ({
        ...prevState,
        [id]: value, // Make sure the field is updated correctly
      }));
    };

    const handleCheckboxChange = (e) => {
      const { name, checked } = e.target;

      if (name === "isForRent" && checked) {
        setFormData((prev) => ({
          ...prev,
          isForRent: true,
          isForSale: false,
        }));
      } else if (name === "isForSale" && checked) {
        setFormData((prev) => ({
          ...prev,
          isForSale: true,
          isForRent: false,
        }));
      } else if (name === "furnished") {
        setFormData((prev) => ({
          ...prev,
          furnished: checked,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: checked,
        }));
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Submitted data:", formData);
      setOpen(false);
    };
    const validateForm = () => {
      return (
        formData.name &&
        formData.description &&
        formData.city &&
        formData.price &&
        formData.property_type &&
        formData.square_meter &&
        formData.bedrooms &&
        formData.bathrooms &&
        formData.living_rooms &&
        formData.balconies &&
        formData.parking_spaces &&
        formData.year_built &&
        formData.images.length > 0 // Ensure images array is not empty
      );
    };
    
 // Function to handle property creation
const handleCreateProperty = async () => {
  // Retrieve the entire user object from localStorage and parse it
  const user = JSON.parse(localStorage.getItem("user"));

  // Check if the user object exists and has a user_id
  if (!user || !user.user_id) {
    console.error("User ID not found in localStorage.");
    return;
  }

  // Log the user object and the user_id
  console.log("User from localStorage:", user);
  console.log("User ID:", user.user_id);

  // Prepare the property data
  const { images, ...propertyData } = formData;

  try {
    // Add user_id to the property data
    const propertyDataWithUserId = { ...propertyData, user_id: user.user_id };

    // Log the property data
    console.log("🔼 Sending Property Create Request:");
    console.log("Endpoint: /property/create");
    console.log("Headers:", {
      Authorization: `Bearer ${PropertyService.getToken?.()}`,
    });
    console.log("Property Data:", propertyDataWithUserId);

    // Send property data with user_id
    const response = await PropertyService.createProperty(propertyDataWithUserId);

    // Log the full response to see its structure
    console.log("Property creation response:", response);

    // Check if the response status is 400
    if (response?.status === 400 && response.data?.errors) {
      // Extract all error messages from response.data.errors
      const errorMessages = response.data.errors.map((err) => err.msg);

      // Log the error messages in the console
      console.log("API Validation Errors:", errorMessages);

      // Set the error messages array to be displayed
      setApiErrors({ messages: errorMessages });

      return; // Exit early since there was a validation error
    }

    // Check if the response contains the necessary fields for success
    if (
      response?.status === 201 &&
      response.data?.message === "Property created successfully"
    ) {
      console.log("Property created successfully:", response.data);

      // Get the property ID from the response
      const propertyId = response.data.property.property_id;

      // Set the propertyId in state
      setPropertyId(propertyId); // Set the propertyId in state

      // If we have images, upload them to the property
      if (images && images.length > 0) {
        console.log(`Adding ${images.length} images for property ${propertyId}`);

        // Process each image individually
        for (const image of images) {
          try {
            console.log("📤 Sending image to PropertyImageService:");
            console.log("Image URL:", image.url);
            console.log("Property ID:", propertyId);
            // Call addPropertyImage for each image URL
            const imageResponse = await PropertyImageService.addPropertyImage(image.url, propertyId);

            console.log(`Image added successfully: ${image.url}`, imageResponse);
          } catch (imageError) {
            console.error(`Error adding image ${image.url}:`, imageError);
            // Continue with other images even if one fails
          }
        }

        console.log(`Finished processing all ${images.length} images`);
      }

      // After successful property creation, open the image upload dialog
      setOpen(false); // Close the property listing dialog
      setImageUploadDialogOpen(true); // Open the image upload dialog
    } else {
      throw new Error("Failed to create property. Response data may be incomplete.");
    }
  } catch (error) {
    console.error("Error creating property:", error);

    // Handle other errors that are not related to validation errors
    if (!error.response || error.response.status !== 400) {
      setApiErrors({ messages: ["An unexpected error occurred. Please try again."] });
    }
  }
};



    const handleImageUpload = async (event) => {
      // Check if we're handling multiple files
      if (
        event &&
        event.target &&
        event.target.files &&
        event.target.files.length > 0
      ) {
        const files = Array.from(event.target.files);
        console.log(`${files.length} file(s) selected for upload`);

        const apiUrl = `https://api.imgbb.com/1/upload?key=${apiKey}`;
  ;

        // Process each file
        for (const file of files) {
          console.log("Processing file:", file.name);

          // Create a new FormData instance for each file
          const formData = new FormData();
          formData.append("image", file);

          try {
            console.log("Uploading file:", file.name);

            const response = await axios.post(apiUrl, formData);

            console.log("Image upload response:", response.data);

            if (response.data.success) {
              const imageUrl = response.data.data.url;
              console.log("Image uploaded successfully:", imageUrl);

              // Store the image URL in the state
              setFormData((prev) => ({
                ...prev,
                images: [
                  ...prev.images,
                  {
                    url: imageUrl,
                    preview: imageUrl,
                    // Store additional data you might need for your API call
                    image_id: response.data.data.id,
                    delete_url: response.data.data.delete_url,
                    timestamp: new Date().toISOString(),
                  },
                ],
              }));
            } else {
              console.error("Upload failed:", response.data.error);
            }
          } catch (error) {
            console.error(
              "Error during file upload:",
              error.response?.data || error.message
            );
          }
        }
      } else if (event instanceof File || event instanceof Blob) {
        // Handle single File/Blob object
        const file = event;
        console.log("Direct file object received:", file.name);

        const formData = new FormData();
        formData.append("image", file);

        const apiUrl = `https://api.imgbb.com/1/upload?key=${apiKey}`;

        try {
          console.log("Uploading file:", file.name);

          const response = await axios.post(apiUrl, formData);

          console.log("Image upload response:", response.data);

          if (response.data.success) {
            const imageUrl = response.data.data.url;
            console.log("Image uploaded successfully:", imageUrl);

            // Store the image URL in the state
            setFormData((prev) => ({
              ...prev,
              images: [
                ...prev.images,
                {
                  url: imageUrl,
                  preview: imageUrl,
                  // Store additional data you might need for your API call
                  image_id: response.data.data.id,
                  delete_url: response.data.data.delete_url,
                  timestamp: new Date().toISOString(),
                },
              ],
            }));

            return imageUrl;
          } else {
            console.error("Upload failed:", response.data.error);
          }
        } catch (error) {
          console.error(
            "Error during file upload:",
            error.response?.data || error.message
          );
        }
      } else {
        console.error("Invalid input for image upload:", event);
        throw new Error(
          "Invalid input for image upload. Expected a file input event or File object."
        );
      }
    };

    const removeImage = (index) => {
      setFormData((prev) => {
        const updatedImages = prev.images.filter((_, i) => i !== index);
        return { ...prev, images: updatedImages };
      });
      console.log(`Image at index ${index} removed successfully`);
    };

    return (
      <>
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setOpen(true)}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            backgroundColor: "#9b87f5",
            "&:hover": {
              backgroundColor: "#7e22ce",
            },
            boxShadow: "0 8px 16px rgba(147, 51, 234, 0.3)",
          }}
        >
          <AddIcon />
        </Fab>

        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: "16px",
              boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)",
              overflow: "hidden",
            },
          }}
        >
          <Paper sx={{ borderRadius: 0 }}>
            <Box sx={{ p: 3, backgroundColor: "#9b87f5", color: "white" }}>
              <Typography variant="h5" fontWeight="600">
                Create New Listing
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                Fill in the details to create your property listing
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <DialogContent sx={{ p: 3, maxHeight: "70vh", overflowY: "auto" }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Property Name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <HomeIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      id="description"
                      value={formData.description}
                      onChange={handleChange}
                      multiline
                      rows={3}
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      options={cities.sort()}
                      value={formData.city}
                      onChange={(event, newValue) =>
                        setFormData((prev) => ({ ...prev, city: newValue || "" }))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="City"
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <>
                                <InputAdornment position="start">
                                  <LocationOnIcon color="action" />
                                </InputAdornment>
                                {params.InputProps.startAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                      disableClearable
                      autoHighlight
                      openOnFocus
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      value={formData.property_type} // Pass the current property type to the value
                      onChange={(event, newValue) =>
                        setFormData((prev) => ({
                          ...prev,
                          property_type: newValue || "",
                        }))
                      }
                      options={["apartment", "villa"]} // The available options
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Property Type"
                          variant="outlined"
                          fullWidth
                        />
                      )}
                      disableClearable // Disable the option to clear the selection
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Square Meters"
                      id="square_meter"
                      type="number"
                      value={formData.square_meter}
                      onChange={handleChange}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SquareFootIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={formData.isForRent ? "$ / month" : "$"}
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={handleChange}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AttachMoneyIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Divider>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ px: 1 }}
                      >
                        Property Details
                      </Typography>
                    </Divider>
                  </Grid>

                  <Grid item xs={12}>
                    <PropertyDetails
                      formData={formData}
                      handleChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Divider>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ px: 1 }}
                      >
                        Listing Type
                      </Typography>
                    </Divider>
                  </Grid>

                  <Grid item xs={12}>
                    <ListingType
                      formData={formData}
                      handleCheckboxChange={handleCheckboxChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                  {apiErrors.messages && apiErrors.messages.length > 0 && (
    <div>
      {apiErrors.messages.map((msg, index) => (
        <Typography key={index} color="error" sx={{ mt: 1 }}>
          {msg}
        </Typography>
      ))}
    </div>
  )}


                    <ImageUpload
                      images={formData.images}
                      onUpload={handleImageUpload}
                      onRemove={removeImage}
                    />
                    {/* Remove duplicate image display section */}
                  </Grid>

                  {/* Create button here */}
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      onClick={handleCreateProperty}
                      variant="contained"
                      sx={{
                        backgroundColor: "#9b87f5",
                        "&:hover": {
                          backgroundColor: "#7e22ce",
                        },
                        color: "#fff",
                        mt: 2,
                      }}
                      disabled={!validateForm()}
                    >
                      Create Listing
                    </Button>
                  </Grid>
                </Grid>
              </DialogContent>
            </form>
          </Paper>
        </Dialog>
      <ImageUploadDialog
  open={imageUploadDialogOpen}
  onClose={() => setImageUploadDialogOpen(false)}
  propertyId={propertyId} // Pass the propertyId as a prop
/>



      </>
    );
  };

  export default ListingButton;
