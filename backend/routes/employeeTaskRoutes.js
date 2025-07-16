import express from "express";
import { createTask, getTasks, updateTask, deleteTask } from "../controllers/employee/employeeTaskController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import multer from "multer";

const router = express.Router();

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Correct routes:
router.post("/", verifyToken, upload.single("file"), createTask);
router.get("/", verifyToken, getTasks);

// ✅ Added routes:
router.put("/:id", verifyToken, updateTask);
router.delete("/:id", verifyToken, deleteTask);

export default router;
