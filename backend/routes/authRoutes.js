import express from "express";
import {
  register,
  login,
  me,
  refresh,
  logout
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, me);
router.get("/refresh", refresh);
router.post("/logout", logout);

export default router;
