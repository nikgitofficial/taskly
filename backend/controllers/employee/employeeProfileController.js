import { put } from "@vercel/blob";
import Employee from "../../models/Employee.js";

// ✅ Get Employee Profile
export const getEmployeeProfile = async (req, res) => {
  try {
    let employee = await Employee.findOne({ userId: req.user.id });
    if (!employee) {
      employee = await Employee.create({ userId: req.user.id });
      console.log("✅ New employee profile created");
    }
    res.json(employee);
  } catch (error) {
    console.error("❌ Error fetching employee profile:", error.message);
    res.status(500).json({ message: "Failed to fetch employee profile" });
  }
};

// ✅ Update Employee Profile (text info)
export const updateEmployeeProfile = async (req, res) => {
  try {
    const { name, department, position } = req.body;
    if (!name || !department || !position) {
      return res.status(400).json({ message: "Name, Department, and Position are required." });
    }
    const updatedEmployee = await Employee.findOneAndUpdate(
      { userId: req.user.id },
      { name, department, position },
      { new: true, upsert: true }
    );
    res.json(updatedEmployee);
  } catch (error) {
    console.error("❌ Error updating profile:", error.message);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

// ✅ Upload Profile Picture
export const uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const { originalname, mimetype, buffer } = req.file;
    const blob = await put(originalname, buffer, {
      access: "public",
      contentType: mimetype,
      addRandomSuffix: true,
    });
    const updatedEmployee = await Employee.findOneAndUpdate(
      { userId: req.user.id },
      { profilePic: blob.url },
      { new: true, upsert: true }
    );
    res.status(201).json({ url: blob.url, employee: updatedEmployee });
  } catch (err) {
    console.error("❌ Upload error:", err.message);
    res.status(500).json({ message: "Profile picture upload failed" });
  }
};
