import express from "express";
import multer from "multer";
import { uploadEmployeeFile, getEmployeeFiles, deleteEmployeeFile } from "../controllers/employeeFileController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", verifyToken, upload.single("file"), uploadEmployeeFile);
router.get("/files", verifyToken, getEmployeeFiles);
router.delete("/delete/:id", verifyToken, deleteEmployeeFile);

export default router;
