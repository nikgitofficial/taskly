import express from "express";
import multer from "multer";
import { getStudentProfile, updateStudentProfile, uploadProfilePic } from "../controllers/student/studentProfileController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();
const upload = multer();

router.get("/profile", verifyToken, getStudentProfile);
router.put("/profile", verifyToken, updateStudentProfile);
router.post("/profile/upload", verifyToken, upload.single("file"), uploadProfilePic);

export default router;
