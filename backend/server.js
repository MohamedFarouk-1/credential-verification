const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5001; // ✅ Ensure it works on Render

// ✅ Allow Netlify frontend to access the backend
app.use(cors({
  origin: ["https://jade-twilight-51fa8c.netlify.app"], // ✅ Replace with your Netlify URL
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type"],
  credentials: true
}));

// ✅ Middleware for JSON parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ✅ Set up Multer storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Add timestamp for uniqueness
  },
});

const upload = multer({ storage });

// ✅ File Upload Endpoint
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  res.json({
    message: "File uploaded successfully!",
    file: req.file,
    url: `${process.env.BACKEND_URL || "https://your-backend-service.onrender.com"}/uploads/${req.file.filename}`
  });
});

// ✅ Serve Uploaded Files
app.use("/uploads", express.static(uploadDir));

// ✅ Fetch Uploaded Files
app.get("/files", (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).json({ message: "Error reading files." });
    }
    res.json({ files });
  });
});

// ✅ Delete File Endpoint
app.delete("/delete/:filename", (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to delete file." });
    }
    res.json({ message: "File deleted successfully!" });
  });
});

// ✅ Ensure the server runs on the correct port
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
