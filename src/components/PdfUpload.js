import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Stack,
  Button,
  Alert,
  TextField,
  CircularProgress,
  Divider,
} from "@mui/material";
import "./PdfUpload.css";
import { uploadDocument } from "./api";
import { saveAs } from "file-saver";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const DocumentUploader = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [dragActivePdf, setDragActivePdf] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [jsonData, setJsonData] = useState({
    data: {
      tower: {
        location: {
          latitude: "",
          longitude: "",
          ground_elevation_m: "",
        },
        structure: {
          height_m: "",
        },
      },
    },
  });
  const [imageData, setImageData] = useState(false);
  const [isDataRendered, setIsDataRendered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const progressBoxRef = useRef(null);

  // Set isEditing to true to keep text fields in edit mode
  // const isEditing = true;

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    setPdfFile(file);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActivePdf(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActivePdf(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    setPdfFile(file);
    setDragActivePdf(false);
  };

  const handleUpload = async () => {
    if (pdfFile) {
      setIsLoading(true);
      progressBoxRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end", // Scroll to the end (bottom)
      });
      try {
        const response = await uploadDocument(pdfFile);

        const jsonData = {
          data: {
            tower: response.data.tower,
            antennas: response.data.antennas,
          },
        };

        const imageData = {
          images: response.data.images,
        };
        console.log(imageData.images.length);
        setJsonData(jsonData);
        setImageData(imageData);
        setIsDataRendered(true);
        setIsEditing(true);
        setUploadSuccess(true);
        setUploadError(false);
        setPdfFile(null);
      } catch (error) {
        setUploadError(true);
        setUploadSuccess(false);
        console.error("Error uploading files:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      alert("Please select a pdf file before uploading.");
    }
  };

  const handleChange = (path, value) => {
    const pathArray = path.split(".");
    const newData = { ...jsonData };
    let current = newData;

    pathArray.forEach((key, index) => {
      const arrayMatch = key.match(/(\w+)\[(\d+)\]/);
      if (arrayMatch) {
        const arrayKey = arrayMatch[1];
        const arrayIndex = parseInt(arrayMatch[2], 10);

        if (!current[arrayKey]) {
          current[arrayKey] = [];
        }

        if (!current[arrayKey][arrayIndex]) {
          current[arrayKey][arrayIndex] = {};
        }

        current = current[arrayKey][arrayIndex];
      } else {
        if (!current[key] && index !== pathArray.length - 1) {
          current[key] = {};
        }

        if (index === pathArray.length - 1) {
          current[key] = value;
        } else {
          current = current[key];
        }
      }
    });

    setJsonData(newData);
  };

  const handleSave = () => {
    const filteredData = {
      data: jsonData.data,
    };

    const jsonBlob = new Blob([JSON.stringify(filteredData, null, 2)], {
      type: "application/json",
    });
    saveAs(jsonBlob, "data.json");

    setIsDataRendered(false); // Reset the state after saving
    setIsEditing(false);
    window.location.reload();
  };

  const renderInputField = (field, value, path) => {
    return (
      <Grid container spacing={2} key={path} alignItems="center">
        <Grid item xs={3}>
          <Typography variant="body1" align="left">
            {field}
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <TextField
            variant="outlined"
            fullWidth
            value={value === undefined || value === null ? "" : value}
            onChange={(e) => handleChange(path, e.target.value)}
            disabled={!isEditing} // Always editable as isEditing is true
            sx={{
              marginBottom: "16px",
            }}
          />
        </Grid>
      </Grid>
    );
  };

  const renderJsonFields = () => {
    return (
      <>
        {/* Tower Data Section */}
        <Box
          sx={{
            display: "flex",
            // flexDirection: "column",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            width: "100%",
            // alignItems: "center",
            // justifyContent: "center",
            // width: "70%",
            margin: "auto",
            padding: 2,
          }}
        >
          <Box sx={{ width: "45%" }}>
            <Typography variant="h6" mb={2}   sx={{ fontWeight: "bold"}}>
              Tower Location
            </Typography>
            {renderInputField(
              "Latitude",
              jsonData.data.tower.location.latitude,
              "data.tower.location.latitude"
            )}
            {renderInputField(
              "Longitude",
              jsonData.data.tower.location.longitude,
              "data.tower.location.longitude"
            )}
            {renderInputField(
              "Ground Elevation (m)",
              jsonData.data.tower.location.ground_elevation_m,
              "data.tower.location.ground_elevation_m"
            )}

            <Typography variant="h6" mt={2} mb={2} sx={{ fontWeight: "bold"}}>
              Tower Structure
            </Typography>
            {renderInputField(
              "Height (m)",
              jsonData.data.tower.structure.height_m,
              "data.tower.structure.height_m"
            )}
          </Box>

          {/* Image Slider for Tower Data */}
          <Box sx={{ width: "45%", ml: 2 }}>
            {imageData.images && imageData.images.length >= 3 ? (
              <Swiper
                spaceBetween={10}
                slidesPerView={1}
                loop={true}
                navigation
                pagination={{ clickable: true }}
                modules={[Navigation, Pagination]}
                style={{ width: "100%", borderRadius: "8px" }}
              >
                {imageData.images.slice(0, 3).map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={`data:image/png;base64,${image.image_data}`}
                      alt={`Slide ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "auto",
                        borderRadius: "8px",
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <Typography variant="body1" align="center">
                No images available
              </Typography>
            )}
          </Box>
        </Box>

        {/* Divider between Tower and Antenna Data */}
        <Divider sx={{ my: 4 }} />

        {/* Antenna Data Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            width: "100%",
            padding: 2,
          }}
        >
          <Box sx={{ width: "45%" }}>
            {/* Render Antennas only if it exists */}
            {jsonData.data.antennas && jsonData.data.antennas.length > 0 && (
              <>
                <Typography variant="h6" mt={2} mb={2} sx={{ fontWeight: "bold"}}>
                  Antennas
                </Typography>
                {jsonData.data.antennas.map((antenna, index) => (
                  <Box key={`antenna-${index}`} mt={2}>
                    <Typography variant="body1" mb={1}>
                      Antenna {index + 1}
                    </Typography>
                    {renderInputField(
                      `Height AGL (m)`,
                      antenna.height_agl_m,
                      `data.antennas[${index}].height_agl_m`
                    )}
                    {renderInputField(
                      `Azimuth (degrees)`,
                      antenna.azimuth_degrees,
                      `data.antennas[${index}].azimuth_degrees`
                    )}
                    {renderInputField(
                      `Mechanical Tilt (degrees)`,
                      antenna.mechanical_tilt_degrees,
                      `data.antennas[${index}].mechanical_tilt_degrees`
                    )}
                  </Box>
                ))}
              </>
            )}
          </Box>
          {/* Image Slider for Antenna Data */}
          <Box sx={{ width: "45%", ml: 2 }}>
            {imageData.images && imageData.images.length >= 6 ? (
              <Swiper
                spaceBetween={10}
                slidesPerView={1}
                loop={true}
                navigation
                pagination={{ clickable: true }}
                modules={[Navigation, Pagination]}
                style={{ width: "100%", borderRadius: "8px" }}
              >
                {imageData.images.slice(3, 13).map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={`data:image/png;base64,${image.image_data}`}
                      alt={`Slide ${index + 4}`}
                      style={{
                        width: "100%",
                        height: "auto",
                        borderRadius: "8px",
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <Typography variant="body1" align="center">
                No images available
              </Typography>
            )}
          </Box>
        </Box>
      </>
    );
  };


  return (
    <Box className="container">
      <Grid container spacing={4} justifyContent="center">
        {/* PDF Uploader */}
        <Grid item xs={12} md={5}>
          <Paper
            className={`custom-paper ${dragActivePdf ? "drag-active" : ""}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => document.getElementById("pdf-upload").click()}
          >
            <Typography variant="h6" className="custom-title">
              Upload PDF Document
            </Typography>
            <Typography>Select or drag & drop a PDF file here.</Typography>
            <input
              id="pdf-upload"
              type="file"
              onChange={handlePdfChange}
              accept="application/pdf"
              hidden
            />
            {pdfFile && (
              <Typography className="file-name">
                Selected file: {pdfFile.name}
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Upload Button */}
      <Box mt={5}>
        <Stack spacing={2} direction="row" justifyContent="center">
          <Button
            variant="contained"
            className="upload-button"
            onClick={handleUpload}
            disabled={isLoading}
          >
            Upload File
          </Button>
        </Stack>
        {/* {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress />
            <span>Uploading...</span>
          </Box>
        )} */}
      </Box>

      {/* Success or Error Message */}
      <Box mt={3}>
        {/* {uploadSuccess && (
          <Alert severity="success" onClose={() => setUploadSuccess(false)}>
            File uploaded successfully!
          </Alert>
        )} */}
        {uploadError && (
          <Alert severity="error" onClose={() => setUploadError(false)}>
            Error uploading file. Please try again.
          </Alert>
        )}
      </Box>

      <Box
        ref={progressBoxRef}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%", // Full width of the parent container
          minHeight: "60vh", // Ensure a reasonable height for visual balance
        }}
      >
        {isDataRendered ? (
          <Paper
            elevation={3}
            sx={{
              p: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "85%", // Width of the Paper component itself
            }}
          >
            <Box sx={{ mt: 4, width: "100%" }}>{renderJsonFields()}</Box>
            {/* Save button positioned at the end of the content */}
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 4, alignSelf: "center" }} // Center-aligning within the Paper
              onClick={handleSave} // Function to handle save action
            >
              Save
            </Button>
          </Paper>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "85%",
              minHeight: "60vh",
              backgroundColor: "#f9fafb", // Light background for contrast
              borderRadius: 2,
              p: 3,
            }}
          >
            {/* Multi-color Circular Progress */}
            {isLoading ? (
              <>
                <CircularProgress
                  sx={{
                    color: "primary.main",
                    mb: 2,
                    animationDuration: "0.75s",
                  }}
                  size={100} // Increase the size to make it bigger
                  thickness={5} // Make the progress bar thicker
                  variant="indeterminate"
                  value={50}
                />
                <Typography variant="h6" color="textSecondary" sx={{ mt: 2 }}>
                  Uploading... Please wait.
                </Typography>
              </>
            ) : (
              <>
                <CloudUploadIcon
                  sx={{ fontSize: 60, color: "primary.main", mb: 2 }}
                />
                <Typography
                  variant="h5"
                  color="textPrimary"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  Let’s Get Started! Upload a File to See Details
                </Typography>

                <Typography
                  variant="body1"
                  color="textSecondary"
                  sx={{ textAlign: "center", mb: 2 }}
                >
                  To begin, please upload a document using the upload box above.
                  Once uploaded, relevant data fields will appear here for you
                  to view and edit.
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ fontStyle: "italic" }}
                >
                  Note: Ensure that the document format is correct and contains
                  the necessary information.
                </Typography>
              </>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DocumentUploader;
