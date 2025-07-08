import express from "express";
import multer from "multer";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  createEntry,
  getEntries,
  updateEntry,
  deleteEntry,
} from "../controllers/studentEntryController.js";

const router = express.Router();

// ✅ Use memoryStorage if you're uploading to Cloudinary or any cloud service
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
});

// ✅ Routes
router.post("/", verifyToken, upload.single("file"), createEntry);
router.get("/", verifyToken, getEntries);
router.put("/:id", verifyToken, upload.single("file"), updateEntry);
router.delete("/:id", verifyToken, deleteEntry);

export default router;
