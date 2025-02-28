// import React, { useState } from "react";
// import {
//   Box,
//   Typography,
//   Paper,
//   Grid,
//   Stack,
//   Button,
//   Alert,
//   TextField,
// } from "@mui/material";
// import "./PdfUpload.css";
// import { uploadDocument } from "./api";

// const DocumentUploader = () => {
//   const [pdfFile, setPdfFile] = useState(null);
//   const [dragActivePdf, setDragActivePdf] = useState(false);
//   const [uploadSuccess, setUploadSuccess] = useState(false);
//   const [uploadError, setUploadError] = useState(false);
//   const [jsonData, setJsonData] = useState({
//     data: {
//       tower: {
//         location: {
//           latitude: "",
//           longitude: "",
//           ground_elevation_m: "",
//         },
//         structure: {
//           height_m: "",
//         },
//       },
//       antennas: [],
//     },
//   });
//   const [editingData, setEditingData] = useState({});
//   const [isEditing, setIsEditing] = useState(false); // State to toggle edit/view mode
//   const [isDataRendered, setIsDataRendered] = useState(false);

//   const handlePdfChange = (e) => {
//     const file = e.target.files[0];
//     setPdfFile(file);
//   };

//   const handleDragEnter = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActivePdf(true);
//   };

//   const handleDragLeave = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActivePdf(false);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     const file = e.dataTransfer.files[0];
//     setPdfFile(file);
//     setDragActivePdf(false);
//   };

//   const handleUpload = async () => {
//     if (pdfFile) {
//       try {

//         const response = await uploadDocument(pdfFile);
//         console.log(response);

//         setJsonData(response);
//         console.log(jsonData);
//         setEditingData(JSON.parse(JSON.stringify(response))); // Create a deep copy for editing
//         setIsDataRendered(true);
//         setUploadSuccess(true);
//         setUploadError(false);
//         setPdfFile(null);
//         setIsEditing(false); // Switch to view mode after upload
//       } catch (error) {
//         setUploadError(true);
//         setUploadSuccess(false);
//         console.error("Error uploading files:", error);
//       }
//     } else {
//       alert("Please select a pdf file before uploading.");
//     }
//   };

//   // const handleChange = (path, value) => {
//   //   const pathArray = path.split(".");
//   //   const newData = { ...editingData };
//   //   let current = newData;
//   //   pathArray.forEach((key, index) => {
//   //     if (index === pathArray.length - 1) {
//   //       current[key] = value;
//   //     } else {
//   //       current = current[key];
//   //     }
//   //   });
//   //   setEditingData(newData);
//   // };

//   const handleChange = (path, value) => {
//     const pathArray = path.split(".");
//     const newData = { ...editingData };
//     let current = newData;

//     pathArray.forEach((key, index) => {
//       // Handle array indices in path, e.g., "antennas[0]"
//       const arrayMatch = key.match(/(\w+)\[(\d+)\]/);
//       if (arrayMatch) {
//         const arrayKey = arrayMatch[1];
//         const arrayIndex = parseInt(arrayMatch[2], 10);

//         if (!current[arrayKey]) {
//           current[arrayKey] = [];
//         }

//         // Expand array size if index is out of bounds
//         if (!current[arrayKey][arrayIndex]) {
//           current[arrayKey][arrayIndex] = {};
//         }

//         current = current[arrayKey][arrayIndex];
//       } else {
//         // For regular keys, ensure the path exists
//         if (!current[key] && index !== pathArray.length - 1) {
//           current[key] = {};
//         }

//         // Update the final key's value
//         if (index === pathArray.length - 1) {
//           current[key] = value;
//         } else {
//           current = current[key];
//         }
//       }
//     });

//     setEditingData(newData);
//   };

//   const handleEdit = () => {
//     setIsEditing(true);
//   };

//   const handleSave = () => {
//     setJsonData(JSON.parse(JSON.stringify(editingData))); // Save the changes to jsonData
//     setIsEditing(false); // Switch back to view mode
//   };

//   const renderInputField = (field, value, path) => {
//     return (
//       <Grid container spacing={2} key={path} alignItems="center">
//         <Grid item xs={3}>
//           <Typography variant="body1" align="left">{field}</Typography>
//         </Grid>
//         <Grid item xs={9}>
//           <TextField
//             variant="outlined"
//             fullWidth
//             value={value || ""}
//             onChange={(e) => handleChange(path, e.target.value)}
//             disabled={!isEditing} // Disable input fields if not editing
//             sx={{
//               marginBottom: "16px", // Add margin-bottom for vertical spacing
//             }}
//           />
//         </Grid>
//       </Grid>
//     );
//   };

//   const renderJsonFields = () => {
//     return (
//       <>
//         <Box  sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center', // Center horizontally
//         justifyContent: 'center', // Center vertically
//         width: '70%', // Set width to 70% of the screen
//         margin: 'auto', // Center the container
//         padding: 2, // Optional padding for better spacing
//       }}>
//           <Typography variant="h6" mb={2}>Tower Location</Typography>
//           {renderInputField(
//             "Latitude",
//             jsonData.data.tower.location.latitude,
//             "tower.location.latitude"
//           )}
//           {renderInputField(
//             "Longitude",
//             jsonData.data.tower.location.longitude,
//             "tower.location.longitude"
//           )}
//           {renderInputField(
//             "Ground Elevation (m)",
//             jsonData.data.tower.location.ground_elevation_m,
//             "tower.location.ground_elevation_m"
//           )}

//           <Typography variant="h6" mt={2} mb={2}>
//             Tower Structure
//           </Typography>
//           {renderInputField(
//             "Height (m)",
//             jsonData.data.tower.structure.height_m,
//             "tower.structure.height_m"
//           )}

//           <Typography variant="h6" mt={2} mb={2}>
//             Antennas
//           </Typography>
//           {jsonData.data.antennas.map((antenna, index) => (
//             <Box key={`antenna-${index}`} mt={2}>
//               <Typography variant="body1" mb={1}>Antenna {index + 1}</Typography>
//               {renderInputField(
//                 `Height AGL (m)`,
//                 antenna.height_agl_m,
//                 `antennas[${index}].height_agl_m`
//               )}
//               {renderInputField(
//                 `Azimuth (degrees)`,
//                 antenna.azimuth_degrees,
//                 `antennas[${index}].azimuth_degrees`
//               )}
//               {renderInputField(
//                 `Mechanical Tilt (degrees)`,
//                 antenna.mechanical_tilt_degrees,
//                 `antennas[${index}].mechanical_tilt_degrees`
//               )}
//             </Box>
//           ))}
//         </Box>
//       </>
//     );
//   };

//   return (
//     <Box className="container">
//       <Grid container spacing={4} justifyContent="center">
//         {/* PDF Uploader */}
//         <Grid item xs={12} md={5}>
//           <Paper
//             className={`custom-paper ${dragActivePdf ? "drag-active" : ""}`}
//             onDragEnter={handleDragEnter}
//             onDragLeave={handleDragLeave}
//             onDragOver={(e) => e.preventDefault()}
//             onDrop={handleDrop}
//             onClick={() => document.getElementById("pdf-upload").click()}
//           >
//             <Typography variant="h6" className="custom-title">
//               Upload PDF Document
//             </Typography>
//             <Typography>Select or drag & drop a PDF file here.</Typography>
//             <input
//               id="pdf-upload"
//               type="file"
//               onChange={handlePdfChange}
//               accept="application/pdf"
//               hidden
//             />
//             {pdfFile && (
//               <Typography className="file-name">
//                 Selected file: {pdfFile.name}
//               </Typography>
//             )}
//           </Paper>
//         </Grid>
//       </Grid>

//       {/* Success or Error Message */}
//       {uploadSuccess && (
//         <Alert severity="success" onClose={() => setUploadSuccess(false)}>
//           Files uploaded successfully!
//         </Alert>
//       )}
//       {uploadError && (
//         <Alert severity="error" onClose={() => setUploadError(false)}>
//           Error uploading files. Please try again.
//         </Alert>
//       )}

//       {/* Upload Button */}
//       <Box mt={5}>
//         <Stack spacing={2} direction="row" justifyContent="center">
//           <Button
//             variant="contained"
//             className="upload-button"
//             onClick={handleUpload}
//           >
//             Upload File
//           </Button>
//         </Stack>
//       </Box>

//       {/* Display JSON Fields (Editable if data is uploaded) */}
//       {renderJsonFields()}

//       {/* Edit Button at the bottom */}
//       {!isEditing ? (
//         <Box mt={2} textAlign="center">
//           <Button variant="contained" onClick={handleEdit} color="primary" disabled={!isDataRendered} >
//             Edit
//           </Button>
//         </Box>
//       ) : (
//         <Box mt={2} textAlign="center">
//           <Button variant="contained" onClick={handleSave} color="success">
//             Save
//           </Button>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default DocumentUploader;