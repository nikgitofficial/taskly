import express from "express";
import { createTask, getTasks, updateTask, deleteTask } from "../controllers/employee/employeeTaskController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import upload from "../middleware/upload.js";

const router = express.Router();



// Correct routes:
router.post("/", verifyToken, upload.single("file"), createTask);
router.get("/", verifyToken, getTasks);

// ✅ Added routes:
router.put("/:id", verifyToken, updateTask);
router.delete("/:id", verifyToken, deleteTask);

export default router;
