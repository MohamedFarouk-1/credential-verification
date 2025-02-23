import React, { useState, useEffect } from "react";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const backendURL = "https://credential-verification.onrender.com";

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch(`${backendURL}/files`);
      if (!response.ok) throw new Error("Failed to fetch files.");
      const result = await response.json();
      setUploadedFiles(result.files || []);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    setIsUploading(true);
    setErrorMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${backendURL}/upload`, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Upload failed! Status: ${response.status}`);
      }

      const result = await response.json();
      alert(result.message || "File uploaded successfully!");

      setFile(null);
      fetchFiles();
    } catch (error) {
      console.error("Error uploading file:", error);
      setErrorMessage("Failed to upload file. Please try again.");
    }

    setIsUploading(false);
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4">
        <h2 className="text-center mb-3">Upload Your Credential</h2>
        {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Select a file:</label>
            <input type="file" className="form-control" onChange={handleFileChange} />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </form>

        <h3 className="mt-4">Uploaded Files</h3>
        <ul className="list-group mt-2">
          {uploadedFiles.length > 0 ? (
            uploadedFiles.map((file, index) => (
              <li key={index} className="list-group-item">
                <a href={`${backendURL}/uploads/${file}`} target="_blank" rel="noopener noreferrer">
                  {file}
                </a>
              </li>
            ))
          ) : (
            <p className="text-muted">No files uploaded yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default UploadForm;
