import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

// Routes
import authRoutes from "./routes/authRoutes.js";
import studentEntryRoutes from "./routes/studentEntryRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import testUploadRoutes from "./routes/testUpload.js";
import blobUploadRoutes from "./routes/blobUploadRoute.js";

// Load env vars
dotenv.config();

// Optional: Debug cloudinary config
console.log("Cloudinary env vars:", {
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
});

// Init express
const app = express();

// ✅ Security
app.use(helmet());

// ✅ CORS config for local + deployed frontend
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL?.replace(/\/$/, "")
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
        console.log("✅ CORS allowed:", origin);
        callback(null, true);
      } else {
        console.warn("❌ CORS blocked:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/student-entries", studentEntryRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/test-upload", testUploadRoutes);
app.use("/api", blobUploadRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("🚀 Taskly backend is running!");
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Uncaught Error:", err.message);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

// Mongo + server start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`✅ Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
