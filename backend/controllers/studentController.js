import Student from "../models/Student.js";
import StudentEntry from "../models/StudentEntry.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// ✅ GET /student/me - fetch or auto-create student profile
export const getStudentProfile = async (req, res) => {
  try {
    let profile = await Student.findOne({ userId: req.user.id });

    if (!profile) {
      profile = await Student.create({
        userId: req.user.id,
        name: "",
        course: "",
        yearLevel: "",
        profilePic: ""
      });
    }

    return res.json({
      name: profile.name,
      course: profile.course,
      yearLevel: profile.yearLevel,
      profilePic: profile.profilePic || ""
    });
  } catch (err) {
    console.error("Error in getStudentProfile:", err);
    return res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// ✅ PUT /student/me - update student profile
export const updateStudentProfile = async (req, res) => {
  try {
    const { name, course, yearLevel } = req.body;
    const updated = await Student.findOneAndUpdate(
      { userId: req.user.id },
      { name, course, yearLevel },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.json({
      name: updated.name,
      course: updated.course,
      yearLevel: updated.yearLevel,
      profilePic: updated.profilePic || ""
    });
  } catch (err) {
    console.error("Error in updateStudentProfile:", err);
    return res.status(500).json({ message: "Failed to update profile" });
  }
};

// ✅ PUT /student/entry/:id - update a specific student entry
export const updateEntry = async (req, res) => {
  try {
    const entry = await StudentEntry.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }
    return res.json(entry);
  } catch (err) {
    console.error("Error in updateEntry:", err);
    return res.status(500).json({ message: "Failed to update entry" });
  }
};

// ✅ DELETE /student/entry/:id - delete a specific student entry
export const deleteEntry = async (req, res) => {
  try {
    const deleted = await StudentEntry.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!deleted) {
      return res.status(404).json({ message: "Entry not found" });
    }
    return res.json({ message: "Entry deleted" });
  } catch (err) {
    console.error("Error in deleteEntry:", err);
    return res.status(500).json({ message: "Failed to delete entry" });
  }
};

// ✅ POST /student/profile-pic - Upload profile picture to Cloudinary
export const uploadProfilePic = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload to Cloudinary
    const cloudRes = await cloudinary.uploader.upload(req.file.path, {
      folder: "student-profile-pics",
      resource_type: "image",
    });

    // Cleanup local temp file
    fs.unlinkSync(req.file.path);

    const updated = await Student.findOneAndUpdate(
      { userId: req.user.id },
      { profilePic: cloudRes.secure_url },
      { new: true }
    );

    res.json({
      name: updated.name,
      course: updated.course,
      yearLevel: updated.yearLevel,
      profilePic: updated.profilePic,
    });
  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};

// ✅ PUT update profile info
export const updateProfile = async (req, res) => {
  try {
    const { name, course, yearLevel } = req.body;

    const student = await Student.findOneAndUpdate(
      { userId: req.user.id },
      { name, course, yearLevel },
      { new: true }
    );

    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};
