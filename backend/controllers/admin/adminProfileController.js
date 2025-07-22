import Admin from "../../models/Admin.js";
import { put } from "@vercel/blob";

// ✅ Get Admin Profile
export const getAdminProfile = async (req, res) => {
  try {
    let admin = await Admin.findOne({ userId: req.user.id });
    if (!admin) {
      admin = await Admin.create({ userId: req.user.id });
      console.log("✅ New admin profile created");
    }
    res.json(admin);
  } catch (error) {
    console.error("❌ Error fetching admin profile:", error.message);
    res.status(500).json({ message: "Failed to fetch admin profile" });
  }
};

// ✅ Update Admin Profile Info
export const updateAdminProfile = async (req, res) => {
  try {
    const { name, department, position } = req.body;
    if (!name || !department || !position) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const updatedAdmin = await Admin.findOneAndUpdate(
      { userId: req.user.id },
      { name, department, position },
      { new: true, upsert: true }
    );
    res.json(updatedAdmin);
  } catch (error) {
    console.error("❌ Error updating profile:", error.message);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

// ✅ Upload Profile Picture
export const uploadAdminProfilePic = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const { originalname, mimetype, buffer } = req.file;
    const blob = await put(originalname, buffer, {
      access: "public",
      contentType: mimetype,
      addRandomSuffix: true,
    });
    const updatedAdmin = await Admin.findOneAndUpdate(
      { userId: req.user.id },
      { profilePic: blob.url },
      { new: true, upsert: true }
    );
    res.status(201).json({ url: blob.url, admin: updatedAdmin });
  } catch (err) {
    console.error("❌ Upload error:", err.message);
    res.status(500).json({ message: "Profile picture upload failed" });
  }
};
