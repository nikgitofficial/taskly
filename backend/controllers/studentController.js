// controllers/studentController.js
import Student from "../models/Student.js";

// @desc    Get student profile
// @route   GET /api/students/profile
// @access  Private
export const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      const newStudent = new Student({ user: req.user.id });
      await newStudent.save();
      return res.json(newStudent);
    }
    res.json(student);
  } catch (err) {
    console.error("Error getting student profile:", err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// @desc    Update student profile
// @route   PUT /api/students/profile
// @access  Private
export const updateStudentProfile = async (req, res) => {
  try {
    const { name, course, yearLevel } = req.body;

    const updated = await Student.findOneAndUpdate(
      { user: req.user.id },
      { name, course, yearLevel },
      { new: true, upsert: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("Error updating student profile:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

// @desc    Save profile picture URL from Vercel Blob to DB
// @route   POST /api/students/profile-pic
// @access  Private
export const uploadProfilePic = async (req, res) => {
  try {
    const { blobUrl } = req.body;

    if (!blobUrl) {
      return res.status(400).json({ message: "No blob URL provided" });
    }

    const updated = await Student.findOneAndUpdate(
      { user: req.user.id },
      { profilePic: blobUrl },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("Failed to update profile pic:", err);
    res.status(500).json({ message: "Server error" });
  }
};
