import React, { useState, useEffect } from "react";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch uploaded files from the backend
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch("http://localhost:5001/files");
      const result = await response.json();
      setUploadedFiles(result.files);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      setFile(null);
      setPreview(null);
      return;
    }

    setFile(selectedFile);

    // Generate a preview for images & PDFs
    const fileType = selectedFile.type;
    if (fileType.startsWith("image/")) {
      setPreview(URL.createObjectURL(selectedFile)); // Show image preview
    } else if (fileType === "application/pdf") {
      setPreview(URL.createObjectURL(selectedFile)); // Show PDF preview
    } else {
      setPreview(null); // No preview for other file types
    }
  };

  const handleRemovePreview = () => {
    setFile(null);
    setPreview(null);
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
      setUploading(true); // Show progress bar
      setUploadProgress(0);

      const response = await fetch("http://localhost:5001/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      alert("File uploaded successfully!");

      setFile(null);
      setPreview(null);
      fetchFiles(); // Refresh file list after upload
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file.");
    } finally {
      setUploading(false); // Hide progress bar
      setUploadProgress(100); // Set progress to full after upload
    }
  };

  const handleDelete = async (filename) => {
    if (!window.confirm(`Are you sure you want to delete ${filename}?`)) return;

    try {
      const response = await fetch(`http://localhost:5001/delete/${filename}`, { method: "DELETE" });
      const result = await response.json();
      
      alert(result.message);
      fetchFiles(); // Refresh the file list after deleting
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Failed to delete file.");
    }
  };

  return (
    <div className="container">
      <h2>Upload Your Credential</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" className="form-control" onChange={handleFileChange} />
        
        {/* File Preview Section */}
        {preview && (
          <div className="mt-3">
            <h5>File Preview:</h5>
            {file.type.startsWith("image/") && (
              <img src={preview} alt="Preview" style={{ maxWidth: "100%", height: "auto", marginTop: "10px" }} />
            )}
            {file.type === "application/pdf" && (
              <embed src={preview} type="application/pdf" width="100%" height="400px" />
            )}
            <button 
              onClick={handleRemovePreview} 
              className="btn btn-danger mt-2"
            >
              Remove Preview
            </button>
          </div>
        )}

        <button type="submit" className="btn mt-3 w-100" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>

        {/* Progress Bar */}
        {uploading && (
          <div style={{ width: "100%", background: "#ccc", marginTop: "10px" }}>
            <div
              style={{
                width: `${uploadProgress}%`,
                height: "5px",
                background: "green",
                transition: "width 0.3s ease-in-out"
              }}
            ></div>
          </div>
        )}
      </form>

      <h3 className="mt-4">Uploaded Files</h3>
      <ul>
        {uploadedFiles.map((file, index) => (
          <li key={index} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <a href={`http://localhost:5001/uploads/${file}`} target="_blank" rel="noopener noreferrer">
              {file}
            </a>
            <button 
              onClick={() => handleDelete(file)} 
              style={{ background: "red", color: "white", border: "none", padding: "5px 10px", cursor: "pointer" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UploadForm;
