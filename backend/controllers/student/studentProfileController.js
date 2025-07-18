import { put } from "@vercel/blob";
import Student from "../../models/Student.js";

// Get Student Profile
export const getStudentProfile = async (req, res) => {
  try {
    let student = await Student.findOne({ userId: req.user.id });
    if (!student) {
      student = await Student.create({ userId: req.user.id });
      console.log("✅ New student profile created");
    }
    res.json(student);
  } catch (error) {
    console.error("❌ Error fetching student profile:", error.message);
    res.status(500).json({ message: "Failed to fetch student profile" });
  }
};

// Update Student Profile (text info)
export const updateStudentProfile = async (req, res) => {
  try {
    const { name, course, yearLevel } = req.body;
    if (!name || !course || !yearLevel) {
      return res.status(400).json({ message: "Name, course, and year level are required." });
    }
    const updatedStudent = await Student.findOneAndUpdate(
      { userId: req.user.id },
      { name, course, yearLevel },
      { new: true, upsert: true }
    );
    res.json(updatedStudent);
  } catch (error) {
    console.error("❌ Error updating profile:", error.message);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

// Upload Profile Picture
export const uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const { originalname, mimetype, buffer } = req.file;
    const blob = await put(originalname, buffer, {
      access: "public",
      contentType: mimetype,
      addRandomSuffix: true,
    });
    const updatedStudent = await Student.findOneAndUpdate(
      { userId: req.user.id },
      { profilePic: blob.url },
      { new: true, upsert: true }
    );
    res.status(201).json({ url: blob.url, student: updatedStudent });
  } catch (err) {
    console.error("❌ Upload error:", err.message);
    res.status(500).json({ message: "Profile picture upload failed" });
  }
};
