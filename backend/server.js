import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

// Routes
import authRoutes from "./routes/authRoutes.js";
import studentEntryRoutes from "./routes/studentEntryRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// ✅ Allow both local dev and production frontend URLs
const allowedOrigins = [
  "http://localhost:5173",         // Vite dev server
  process.env.CLIENT_URL           // Your Vercel production URL
];

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like Postman) or from allowed origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
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

// DB connection and server start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`✅ Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
