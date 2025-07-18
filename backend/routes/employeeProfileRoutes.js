import express from "express";
import multer from "multer";
import {
  getEmployeeProfile,
  updateEmployeeProfile,
  uploadProfilePic
} from "../controllers/employee/employeeProfileController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();
const upload = multer();

router.get("/profile", verifyToken, getEmployeeProfile);
router.put("/profile", verifyToken, updateEmployeeProfile);
router.post("/profile/upload", verifyToken, upload.single("file"), uploadProfilePic);

export default router;
