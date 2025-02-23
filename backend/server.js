const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: "*", // Allow all origins
  methods: "GET,POST",
  allowedHeaders: "Content-Type"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Ensure "uploads" directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ✅ Configure Multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and PDF are allowed."));
    }
  },
});

// ✅ Serve uploaded files statically
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    return res.json({
      message: "File uploaded successfully!",
      file: req.file.filename,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: "Server error while uploading file." });
  }
});


// ✅ Fetch Uploaded Files Endpoint
app.get("/files", (req, res) => {
  try {
    fs.readdir(uploadDir, (err, files) => {
      if (err) {
        console.error("Error reading files:", err);
        return res.status(500).json({ message: "Unable to scan files." });
      }
      return res.json({ files });
    });
  } catch (error) {
    console.error("Error fetching files:", error);
    return res.status(500).json({ message: "Server error while fetching files." });
  }
});


// ✅ Start Server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// ✅ Handle unexpected shutdowns
process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Server closed due to SIGTERM");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Server closed due to SIGINT");
    process.exit(0);
  });
});
