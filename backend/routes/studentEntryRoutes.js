import express from "express";
import {
  createEntry,
  getEntries,
  updateEntry,
  deleteEntry,
} from "../controllers/studentEntryController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { upload } from "../middleware/upload.js"; // memory multer

const router = express.Router();

// Routes with Cloudinary file upload support
router.post("/", verifyToken, upload.single("file"), createEntry);
router.get("/", verifyToken, getEntries);
router.put("/:id", verifyToken, upload.single("file"), updateEntry);
router.delete("/:id", verifyToken, deleteEntry);

export default router;
