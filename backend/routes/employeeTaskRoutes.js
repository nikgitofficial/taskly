import express from "express";
import { createTask, getTasks, updateTask, deleteTask } from "../controllers/employee/employeeTaskController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// ✅ Clean routes (no multer):
router.post("/", verifyToken, createTask);
router.get("/", verifyToken, getTasks);
router.put("/:id", verifyToken, updateTask);
router.delete("/:id", verifyToken, deleteTask);

export default router;
