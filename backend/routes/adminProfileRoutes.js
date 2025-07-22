import express from "express";
import multer from "multer";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  getAdminProfile,
  updateAdminProfile,
  uploadAdminProfilePic
} from "../controllers/admin/adminProfileController.js";

const router = express.Router();
const upload = multer();

router.get("/profile", verifyToken, getAdminProfile);
router.put("/profile", verifyToken, updateAdminProfile);
router.post("/profile/upload", verifyToken, upload.single("file"), uploadAdminProfilePic);

export default router;
