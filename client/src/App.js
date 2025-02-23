import React from "react";
import UploadForm from "./UploadForm";
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Credential Verification System</h1>
        <p>Upload your credentials and verify them securely.</p>
        <UploadForm />
      </header>
    </div>
  );
}

export default App;
