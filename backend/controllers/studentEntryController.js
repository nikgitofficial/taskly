import StudentEntry from "../models/StudentEntry.js";
import { streamUpload } from "../utils/cloudinary.js";

// ✅ CREATE ENTRY
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
      console.log("📎 Uploading new file:", req.file.originalname);
      const result = await streamUpload(req.file.buffer, req.file.mimetype);
      if (!result?.secure_url) throw new Error("Cloudinary upload failed: No URL returned");
      newEntry.fileUrl = result.secure_url;
      console.log("✅ File uploaded:", result.secure_url);
    }

    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (error) {
    console.error("❌ Error creating entry:", error);
    res.status(500).json({
      message: "Server error while creating entry",
      error: error.message,
    });
  }
};

// ✅ GET ENTRIES
export const getEntries = async (req, res) => {
  try {
    const entries = await StudentEntry.find({ userId: req.user.id }).sort({ date: 1 });
    res.json(entries);
  } catch (error) {
    console.error("❌ Error fetching entries:", error);
    res.status(500).json({ message: "Server error while fetching entries" });
  }
};

// ✅ UPDATE ENTRY
export const updateEntry = async (req, res) => {
  try {
    const entry = await StudentEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Entry not found" });
    if (entry.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    const { title, description, category, date, done } = req.body;

    // 🔁 Upload new file if provided
    if (req.file) {
      console.log("📎 Updating file:", req.file.originalname);
      const result = await streamUpload(req.file.buffer, req.file.mimetype);
      if (!result?.secure_url) throw new Error("Cloudinary upload failed: No URL returned");
      entry.fileUrl = result.secure_url;
      console.log("✅ File re-uploaded:", result.secure_url);
    }

    // 🧠 Update only provided fields
    if (title !== undefined) entry.title = title;
    if (description !== undefined) entry.description = description;
    if (category !== undefined) entry.category = category;
    if (date !== undefined) entry.date = date;
    if (done !== undefined) entry.done = done;

    await entry.save();
    res.json(entry);
  } catch (error) {
    console.error("❌ Error updating entry:", error);
    res.status(500).json({
      message: "Server error while updating entry",
      error: error.message,
    });
  }
};

// ✅ DELETE ENTRY
export const deleteEntry = async (req, res) => {
  try {
    const entry = await StudentEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Entry not found" });
    if (entry.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    await entry.deleteOne();
    res.json({ message: "Entry deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting entry:", error);
    res.status(500).json({
      message: "Server error while deleting entry",
      error: error.message,
    });
  }
};
