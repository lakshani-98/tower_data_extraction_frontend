import axios from "axios";

const DOCUMENT_UPLOAD_URL = "http://50.18.6.120:8439";

  // Function to upload documents
export const uploadDocument = async (pdfFile) => {
    const model = "Gpt";
    const formData = new FormData();
    formData.append("pdf", pdfFile);
    formData.append("metadata", JSON.stringify({ model }));
  
    try {
      const response = await axios.post(DOCUMENT_UPLOAD_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 600000, 
      });
      return response;
    } catch (error) {
      console.log(error.response);
      throw error;
    }
  };



