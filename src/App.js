import logo from "./logo.svg";
import "./App.css";
import React from "react";
import PdfUpload from "./components/PdfUpload";
import { Typography, Box } from "@mui/material";

function App() {
  return (
    <div className="App">
      {/* <Box display="flex" justifyContent="center" alignItems="center">
        <Typography variant="h4" className="title">
          Tower Data Extraction
        </Typography>
      </Box> */}
      <section className="hero-section">
        <h1 className="main">Extract the tower and equipment data from documents</h1>
      </section>
      <PdfUpload />
    </div>
  );
}

export default App;
