import StudentEntry from "../models/StudentEntry.js";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";

// Helper to upload buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// ✅ Create Entry with File Upload
export const createEntry = async (req, res) => {
  try {
    const { title, description, category, date } = req.body;

    let fileUrl = null;
    let fileName = null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      fileUrl = result.secure_url;
      fileName = result.original_filename;
    }

    const newEntry = await StudentEntry.create({
      userId: req.user.id,
      title,
      description,
      category,
      date,
      fileUrl,
      fileName,
      user: req.user.id,
    });

    res.status(201).json(newEntry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create entry" });
  }
};

// ✅ Get Entries (filtered by user)
export const getEntries = async (req, res) => {
  try {
    const entries = await StudentEntry.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch entries" });
  }
};

// ✅ Update Entry (with optional file upload)
export const updateEntry = async (req, res) => {
  try {
    const entry = await StudentEntry.findOne({ _id: req.params.id, userId: req.user.id });
    if (!entry) return res.status(404).json({ message: "Entry not found" });

    const updateData = req.body;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      updateData.fileUrl = result.secure_url;
      updateData.fileName = result.original_filename;
    }

    const updated = await StudentEntry.findByIdAndUpdate(entry._id, updateData, { new: true });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update entry" });
  }
};

// ✅ Delete Entry
export const deleteEntry = async (req, res) => {
  try {
    const deleted = await StudentEntry.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!deleted) return res.status(404).json({ message: "Entry not found" });

    res.json({ message: "Entry deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete entry" });
  }
};
