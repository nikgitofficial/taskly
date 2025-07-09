import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  createEntry,
  getEntries,
  updateEntry,
  deleteEntry,
} from "../controllers/studentEntryController.js";

const router = express.Router();

// ✅ Routes (no multer, no file upload)
router.post("/", verifyToken, createEntry);
router.get("/", verifyToken, getEntries);
router.put("/:id", verifyToken, updateEntry);
router.delete("/:id", verifyToken, deleteEntry);

export default router;
