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

const app = express();

// Log loaded CLIENT_URL
console.log("✅ Loaded CLIENT_URL:", process.env.CLIENT_URL);

const allowedOrigins = [
  "http://localhost:5173",
  "https://taskly-plum.vercel.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      const cleanOrigin = origin?.replace(/\/$/, "");
      console.log("🌐 CORS check:", cleanOrigin);

      if (!origin || allowedOrigins.includes(cleanOrigin)) {
        console.log("✅ CORS allowed:", cleanOrigin);
        callback(null, true);
      } else {
        console.warn("❌ CORS blocked:", cleanOrigin);
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

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/student-entries", studentEntryRoutes);
app.use("/api/students", studentRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("🚀 Taskly backend is running!");
});

// Connect DB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`✅ Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
