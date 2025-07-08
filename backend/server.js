import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet"; // ✅ added helmet

// Routes
import authRoutes from "./routes/authRoutes.js";
import studentEntryRoutes from "./routes/studentEntryRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import testUploadRoutes from "./routes/testUpload.js";

// Load environment variables
dotenv.config();

console.log("Cloudinary env vars:", {
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
});

// Create Express app
const app = express();

// ✅ Apply security middleware
app.use(helmet());

// ✅ Allow both local dev and production frontend URLs
const allowedOrigins = [
  "http://localhost:5173",                   // Local dev
  process.env.CLIENT_URL?.replace(/\/$/, "") // Vercel (no trailing slash)
];

// CORS configuration
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

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Route handlers
app.use("/api/auth", authRoutes);
app.use("/api/student-entries", studentEntryRoutes);
app.use("/api/students", studentRoutes);
app.use("/api", testUploadRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("🚀 Taskly backend is running!");
});

// Optional: Fallback error handler
app.use((err, req, res, next) => {
  console.error("❌ Uncaught Error:", err.message);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

// DB connection and server start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`✅ Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
