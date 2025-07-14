import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getStudentProfile, updateStudentProfile } from "../controllers/studentController.js";

const router = express.Router();

router.get("/profile", verifyToken, getStudentProfile);
router.put("/profile", verifyToken, updateStudentProfile);

export default router;
