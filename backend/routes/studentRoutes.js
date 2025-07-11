// routes/studentRoutes.js
import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  getStudentProfile,
  updateStudentProfile,
  uploadProfilePic,
} from "../controllers/studentController.js";

const router = express.Router();

// Profile routes
router.get("/profile", verifyToken, getStudentProfile);
router.put("/profile", verifyToken, updateStudentProfile);

// Receive Vercel Blob URL and save to DB
router.post("/profile-pic", verifyToken, uploadProfilePic);

export default router;
