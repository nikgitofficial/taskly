// routes/studentRoutes.js
import express from "express"; // ✅ Needed to use express.Router()
import multer from "multer";   // ✅ Needed for file upload

import { verifyToken } from "../middleware/authMiddleware.js";
import {
  getStudentProfile,
  updateStudentProfile,
  uploadProfilePicCloudinary,
} from "../controllers/studentController.js";

const router = express.Router();

// Use memory storage to upload to Cloudinary
const upload = multer({ storage: multer.memoryStorage() });

router.get("/profile", verifyToken, getStudentProfile);
router.put("/profile", verifyToken, updateStudentProfile);
router.post("/profile-pic", verifyToken, upload.single("file"), uploadProfilePicCloudinary);

export default router;
