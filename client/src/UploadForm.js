import React from "react";

const UploadForm = () => {
  return (
    <div className="container">
      <h2>Upload Your Credential</h2>
      <form>
        <input type="file" className="form-control" />
        <button type="submit" className="btn mt-3 w-100">Upload</button>
      </form>
    </div>
  );
};

export default UploadForm;
