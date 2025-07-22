// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

// Routes
import authRoutes from "./routes/authRoutes.js";
import studentEntryRoutes from "./routes/studentEntryRoutes.js";
import studentFileRoutes from "./routes/studentFileRoutes.js";  
import studentProfileRoutes from "./routes/studentProfileRoutes.js";
import employeeProfileRoutes from "./routes/employeeProfileRoutes.js";
import employeeTaskRoutes from "./routes/employeeTaskRoutes.js";
import employeeFileRoutes from "./routes/employeeFileRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import contactRoutes from './routes/contactRoutes.js';
import adminProfileRoutes from "./routes/adminProfileRoutes.js";


dotenv.config();
const app = express();

// Middleware
app.use(helmet());
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL?.replace(/\/$/, "")
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow healthchecks and internal calls without origin
    if (!origin) return callback(null, true);

    const cleanedOrigin = origin.replace(/\/$/, "");
    if (allowedOrigins.includes(cleanedOrigin)) {
      console.log(`✅ [CORS] Allowed: ${cleanedOrigin}`);
      return callback(null, true);
    }

    console.warn(`❌ [CORS] Blocked: ${cleanedOrigin}`);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/student-entries", studentEntryRoutes);
app.use("/api/students-profile", studentProfileRoutes);
app.use("/api/student-files", studentFileRoutes);
app.use("/api/employees-profile", employeeProfileRoutes);
app.use("/api/employee-tasks", employeeTaskRoutes);
app.use("/api/employee-files", employeeFileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/profile", adminProfileRoutes);
app.use('/api/contact', contactRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Taskly backend is running!");
});

app.use((err, req, res, next) => {
  console.error("❌ Uncaught Error:", err.message);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch(err => console.error("❌ MongoDB connection error:", err));
