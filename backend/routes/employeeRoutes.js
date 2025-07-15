import express from "express";
import Employee from "../models/Employee.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// ✅ GET all employees (protected)
router.get("/", verifyToken, async (req, res) => {
  try {
    const employees = await Employee.find().populate("userId", "email");
    console.log(`✔️ Fetched ${employees.length} employees`);
    res.json(employees);
  } catch (err) {
    console.error("❌ Error fetching employees:", err.message);
    res.status(500).json({ message: "Failed to fetch employees" });
  }
});

// ✅ GET my employee profile (protected)
router.get("/me", verifyToken, async (req, res) => {
  try {
    console.log("✔️ Extracted userId from token:", req.user.id);

    const employee = await Employee.findOne({ userId: req.user.id }).populate("userId", "email");
    if (!employee) {
      console.warn("⚠️ Employee profile not found for user:", req.user.id);
      return res.status(404).json({ message: "Employee profile not found" });
    }

    console.log("✔️ Employee profile found:", {
      id: employee._id,
      name: employee.name,
      email: employee.userId?.email,
    });

    res.status(200).json({
      _id: employee._id,
      name: employee.name,
      department: employee.department,
      position: employee.position,
      email: employee.userId?.email,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    });
  } catch (err) {
    console.error("❌ Failed to fetch employee profile:", err.message);
    res.status(500).json({ message: "Failed to fetch employee profile" });
  }
});

export default router;
