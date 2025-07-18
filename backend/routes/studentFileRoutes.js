
import express from "express";
import multer from "multer";
import {
  uploadFile,
  getUserFiles,
  downloadFile,
  renameFile,
  deleteFile,
} from "../controllers/studentFileController/studentUploadFileController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Set up memory storage for multer
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", verifyToken, upload.single("file"), uploadFile);
router.get("/files", verifyToken, getUserFiles);
router.get("/download/:id", verifyToken, downloadFile);
router.put("/rename/:id", verifyToken, renameFile);
router.delete("/delete/:id", verifyToken, deleteFile);

export default router;
