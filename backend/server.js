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
  "http://localhost:5173",                   // Local dev
  process.env.CLIENT_URL?.replace(/\/$/, "") // Deployed frontend
];

// ✅ CORS configuration
const corsOptions = {
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
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200, // legacy browser support
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // ✅ Handle preflight requests

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/student-entries", studentEntryRoutes);
app.use("/api/students", studentRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("🚀 Taskly backend is running!");
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
