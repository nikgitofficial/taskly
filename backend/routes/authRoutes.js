// routes/authRoutes.js
import express from "express";
import {
  register,
  login,
  me,
  refreshToken,
  logout,
} from "../controllers/auth/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/register", register);        // ➤ Register user
router.post("/login", login);              // ➤ Login, return access + cookie
router.get("/me", verifyToken, me);        // ➤ Get current user (protected route)
router.get("/refresh", refreshToken);      // ➤ Issue new access token from refresh token cookie
router.post("/logout", logout);            // ➤ Clear refresh token cookie

export default router;
