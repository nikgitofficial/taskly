import StudentEntry from "../models/StudentEntry.js";
import { streamUpload } from "../utils/cloudinary.js";

export const createEntry = async (req, res) => {
  try {
    const { title, description, category, date } = req.body;

    const newEntry = new StudentEntry({
      userId: req.user.id,
      title,
      description,
      category,
      date,
      done: false,
    });

    if (req.file) {
      console.log("📎 File upload detected:", {
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      });

      try {
        const result = await streamUpload(req.file.buffer, req.file.mimetype);
        if (!result || !result.secure_url) {
          console.error("❌ Invalid Cloudinary response:", result);
          return res.status(500).json({ message: "Upload failed: No secure_url returned" });
        }
        newEntry.fileUrl = result.secure_url;
        console.log("✅ Cloudinary upload successful:", result.secure_url);
      } catch (uploadErr) {
        console.error("❌ Cloudinary upload failed:", uploadErr);
        return res.status(500).json({ message: uploadErr.message || "File upload to Cloudinary failed" });
      }
    }

    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (error) {
    console.error("❌ Error creating entry:", error);
    res.status(500).json({
      message: "Server error while creating entry",
      error: error.message,
      stack: error.stack,
    });
  }
};

export const getEntries = async (req, res) => {
  try {
    const entries = await StudentEntry.find({ userId: req.user.id }).sort({ date: 1 });
    res.json(entries);
  } catch (error) {
    console.error("❌ Error fetching entries:", error);
    res.status(500).json({ message: "Server error while fetching entries" });
  }
};

export const updateEntry = async (req, res) => {
  try {
    const entry = await StudentEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Entry not found" });
    if (entry.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    const { title, description, category, date, done } = req.body;

    if (req.file) {
      console.log("📎 Updating file:", {
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      });

      try {
        const result = await streamUpload(req.file.buffer, req.file.mimetype);
        if (!result || !result.secure_url) {
          console.error("❌ Invalid Cloudinary response:", result);
          return res.status(500).json({ message: "Upload failed: No secure_url returned" });
        }
        entry.fileUrl = result.secure_url;
        console.log("✅ Cloudinary re-upload successful:", result.secure_url);
      } catch (uploadErr) {
        console.error("❌ Cloudinary upload failed:", uploadErr);
        return res.status(500).json({ message: uploadErr.message || "File upload to Cloudinary failed" });
      }
    }

    // Apply updates
    entry.title = title || entry.title;
    entry.description = description || entry.description;
    entry.category = category || entry.category;
    entry.date = date || entry.date;
    if (typeof done !== "undefined") entry.done = done;

    await entry.save();
    res.json(entry);
  } catch (error) {
    console.error("❌ Error updating entry:", error);
    res.status(500).json({
      message: "Server error while updating entry",
      error: error.message,
      stack: error.stack,
    });
  }
};

export const deleteEntry = async (req, res) => {
  try {
    const entry = await StudentEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Entry not found" });
    if (entry.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    await entry.deleteOne();
    res.json({ message: "Entry deleted" });
  } catch (error) {
    console.error("❌ Error deleting entry:", error);
    res.status(500).json({
      message: "Server error while deleting entry",
      error: error.message,
      stack: error.stack,
    });
  }
};
