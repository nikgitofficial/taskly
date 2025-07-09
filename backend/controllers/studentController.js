import Student from "../models/Student.js";
import cloudinary from "../utils/cloudinary.js";
import { Readable } from "stream";

// Convert Buffer to Stream
function bufferToStream(buffer) {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
}

// @desc    Get student profile
// @route   GET /api/students/profile
// @access  Private
export const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      // If student profile doesn't exist, create a blank one
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

// @desc    Upload profile picture to Cloudinary
// @route   POST /api/students/profile-pic
// @access  Private
export const uploadProfilePicCloudinary = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "student_profiles",
        public_id: `user_${req.user.id}`,
        overwrite: true,
      },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary error:", error);
          return res.status(500).json({ message: "Upload failed", error });
        }

        const updated = await Student.findOneAndUpdate(
          { user: req.user.id },
          { profilePic: result.secure_url },
          { new: true }
        );

        res.json(updated);
      }
    );

    bufferToStream(req.file.buffer).pipe(stream);
  } catch (err) {
    console.error("Server error during profile pic upload:", err);
    res.status(500).json({ message: "Server error uploading profile pic" });
  }
};
