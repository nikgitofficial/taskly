// routes/adminRoutes.js
import express from "express";
import { getDashboardSummary, getUserDetails } from "../controllers/admin/adminController.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/dashboard-summary", verifyToken, verifyAdmin, getDashboardSummary);
router.get("/user/:id", verifyToken, verifyAdmin, getUserDetails);



export default router;
