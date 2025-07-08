import express from "express";
import {
  getStudentProfile,
  updateStudentProfile,
  uploadProfilePic,
  updateProfile
} from "../controllers/studentController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import multer from "multer";
import { storage } from "../utils/cloudinary.js";

const router = express.Router();
const cloudinaryUpload = multer({ storage }); // ✅ renamed for Cloudinary

router.get("/me", verifyToken, getStudentProfile);
router.put("/me", verifyToken, updateStudentProfile);
router.post("/profile-pic", verifyToken, cloudinaryUpload.single("file"), uploadProfilePic);
router.put("/profile", verifyToken, updateProfile);

export default router;
