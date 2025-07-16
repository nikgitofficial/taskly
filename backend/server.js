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
import blobUploadRoutes from "./routes/blobUploadRoute.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import employeeTaskRoutes from "./routes/employeeTaskRoutes.js";
import employeeFileRoute from "./routes/employeeFileRoute.js";

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(helmet());
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/student-entries", studentEntryRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/blob", blobUploadRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/employee-tasks", employeeTaskRoutes);
app.use("/api/employee-files", employeeFileRoute);

app.get("/", (req, res) => {
  res.send("🚀 Taskly backend is running!");
});

app.use((err, req, res, next) => {
  console.error("❌ Uncaught Error:", err.message);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
