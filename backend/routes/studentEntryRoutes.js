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
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", verifyToken, upload.single("file"), createEntry);
router.get("/", verifyToken, getEntries);
router.put("/:id", verifyToken, upload.single("file"), updateEntry);
router.delete("/:id", verifyToken, deleteEntry);

export default router;
