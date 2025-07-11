import express from "express";
import {
  register,
  login,
  me,
  refresh,
  logout
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js"; // ✅ correct file and function name

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, me);
router.get("/refresh", refresh);
router.post("/logout", logout);

export default router;
