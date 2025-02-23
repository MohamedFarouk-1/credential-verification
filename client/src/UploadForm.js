import React, { useState, useEffect } from "react";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  
  // ✅ Use the correct backend URL
  const backendURL = "https://credential-verification.onrender.com"; 

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch(`${backendURL}/files`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      setUploadedFiles(result.files || []);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${backendURL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed! Status: ${response.status}`);
      }

      alert("File uploaded successfully!");
      setFile(null);
      fetchFiles();
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file.");
    }
  };

  return (
    <div className="container">
      <h2>Upload Your Credential</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" className="form-control" onChange={handleFileChange} />
        <button type="submit" className="btn mt-3 w-100">Upload</button>
      </form>

      <h3 className="mt-4">Uploaded Files</h3>
      <ul>
        {uploadedFiles.length > 0 ? (
          uploadedFiles.map((file, index) => (
            <li key={index}>
              <a href={`${backendURL}/uploads/${file}`} target="_blank" rel="noopener noreferrer">
                {file}
              </a>
            </li>
          ))
        ) : (
          <p>No files uploaded yet.</p>
        )}
      </ul>
    </div>
  );
};

export default UploadForm;
