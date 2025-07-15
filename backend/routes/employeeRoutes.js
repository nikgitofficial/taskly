import express from "express";
import Employee from "../models/Employee.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// GET all employees (protected)
router.get("/", verifyToken, async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch employees" });
  }
});

// GET my employee profile
router.get("/me", verifyToken, async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.user.id });
    if (!employee) return res.status(404).json({ message: "Employee profile not found" });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch employee profile" });
  }
});

export default router;
