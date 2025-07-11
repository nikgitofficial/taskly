// routes/authRoutes.js
import express from "express";
import {
  register,
  login,
  me,
  refreshToken,
  logout,
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, me);
router.get("/refresh", refreshToken);
router.post("/logout", logout);

export default router;
