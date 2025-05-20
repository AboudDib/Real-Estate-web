/**
 * VRImageUploadDialog Component
 *
 * A modal dialog that allows users to upload 360° images for a property and optionally save them
 * to the backend via the PropertyModelService. These images are intended for use in virtual reality or 3D views.
 *
 * Features:
 * - File input for multiple image uploads (accepted: all image formats)
 * - Base64 conversion and upload to ImgBB via their API
 * - Displays previews of uploaded images
 * - Option to remove uploaded images before submission
 * - On "Create 360 Images", sends the uploaded image URLs to the backend to be saved as property models
 * - Option to skip the upload and close the dialog
 *
 * Props:
 * - open (boolean): Controls the visibility of the dialog
 * - onClose (function): Callback to close the dialog
 * - propertyId (string | number): The ID of the property the 360 images are linked to
 *
 */
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Grid,
  Button,
  InputLabel,
  Paper,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import PropertyModelService from "../services/PropertyModelService";

const VRImageUploadDialog = ({ open, onClose, propertyId }) => {
  const [images360, setImages360] = useState([]);
  const [loading, setLoading] = useState(false);

  const handle360ImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;

    for (const file of files) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result.split(",")[1];

        try {
          const res = await fetch(
            `https://api.imgbb.com/1/upload?key=${apiKey}`,
            {
              method: "POST",
              body: new URLSearchParams({ image: base64Image }),
            }
          );

          const result = await res.json();
          if (result.success) {
            const imageUrl = result.data.url;
            setImages360((prev) => [
              ...prev,
              {
                url: imageUrl,
                preview: imageUrl,
                image_id: result.data.id,
              },
            ]);
          } else {
            console.error("❌ ImgBB upload failed:", result.error?.message);
          }
        } catch (error) {
          console.error("❌ Error uploading to ImgBB:", error);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const remove360Image = (index) => {
    setImages360((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreate360Images = async () => {
    setLoading(true);
    try {
      for (const image of images360) {
        await PropertyModelService.createPropertyModel({
          model_url: image.url,
          property_id: propertyId,
        });
      }
      console.log("✅ All property models created successfully");
      onClose();
    } catch (error) {
      console.error("❌ Error creating property models:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Paper sx={{ borderRadius: 0 }}>
        <Box sx={{ p: 3, backgroundColor: "#9b87f5", color: "white" }}>
          <Typography variant="h5" fontWeight="600">
            Upload 360 Images
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
            Upload 360° room images or skip this step.
          </Typography>
        </Box>

        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <InputLabel sx={{ mb: 1 }}>360 Images</InputLabel>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                disabled={loading}
                startIcon={<ImageIcon />}
                sx={{
                  p: 1.5,
                  borderColor: "#9b87f5",
                  color: "#9b87f5",
                  "&:hover": {
                    borderColor: "#7e22ce",
                    backgroundColor: "rgba(147, 51, 234, 0.05)",
                  },
                }}
              >
                Upload 360° Pictures
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handle360ImageUpload}
                />
              </Button>

              {images360.length > 0 && (
                <Paper
                  elevation={0}
                  sx={{
                    mt: 2,
                    p: 2,
                    backgroundColor: "rgba(147, 51, 234, 0.05)",
                    borderRadius: 2,
                    position: "relative", // Make container relative for absolute spinner
                    minHeight: 120, // Reserve space for spinner
                  }}
                >
                  <Typography variant="subtitle2" color="#9b87f5" gutterBottom>
                    Uploaded Images: {images360.length}
                  </Typography>

                  {loading && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 10,
                        bgcolor: "rgba(255,255,255,0.7)",
                        borderRadius: 1,
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <CircularProgress sx={{ color: "#9b87f5" }} />
                    </Box>
                  )}

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(100px, 1fr))",
                      gap: 1,
                      opacity: loading ? 0.3 : 1, // Dim images while loading
                      pointerEvents: loading ? "none" : "auto", // Disable interactions
                    }}
                  >
                    {images360.map((image, index) => (
                      <Paper
                        key={index}
                        sx={{
                          position: "relative",
                          paddingTop: "100%",
                          overflow: "hidden",
                          borderRadius: 1,
                        }}
                      >
                        <Box
                          component="img"
                          src={image.preview}
                          alt={`Preview ${index + 1}`}
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <Button
                          onClick={() => remove360Image(index)}
                          sx={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            minWidth: "24px",
                            width: "24px",
                            height: "24px",
                            p: 0,
                            borderRadius: "50%",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "rgba(0, 0, 0, 0.7)",
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
            </Grid>

            <Grid item xs={12}>
              <Button
                fullWidth
                variant="outlined"
                onClick={onClose}
                disabled={loading}
                sx={{
                  color: "#9b87f5",
                  borderColor: "#9b87f5",
                  mt: 2,
                }}
              >
                Skip 360 Image Upload
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleCreate360Images}
                disabled={loading}
                sx={{
                  backgroundColor: "#9b87f5",
                  color: "white",
                  mt: 1,
                  minHeight: 48,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : (
                  "Create 360 Images"
                )}
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Paper>
    </Dialog>
  );
};

export default VRImageUploadDialog;
