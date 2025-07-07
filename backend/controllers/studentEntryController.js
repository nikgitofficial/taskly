import StudentEntry from "../models/StudentEntry.js";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";

const uploadToCloudinary = (buffer, mimetype) => {
  const resourceType = mimetype === "application/pdf" ? "raw" : "auto";

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: auto,
        folder: "student_entries",
        type: "upload",
        use_filename: true,
        unique_filename: false,
       
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};


// ✅ Create Entry
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

    const newEntry = new StudentEntry({
      userId: req.user.id,
      title,
      description,
      category,
      date,
      fileUrl,
      fileName,
    });

    const saved = await newEntry.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Create Entry Error:", err);
    res.status(500).json({ message: "Failed to create entry" });
  }
};

// ✅ Get Entries by User
export const getEntries = async (req, res) => {
  try {
    const entries = await StudentEntry.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    console.error("❌ Fetch Entries Error:", err);
    res.status(500).json({ message: "Failed to fetch entries" });
  }
};

// ✅ Update Entry
export const updateEntry = async (req, res) => {
  try {
    const entry = await StudentEntry.findOne({ _id: req.params.id, userId: req.user.id });
    if (!entry) return res.status(404).json({ message: "Entry not found" });

    const updateData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      date: req.body.date,
      done: req.body.done,
    };

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      updateData.fileUrl = result.secure_url;
      updateData.fileName = result.original_filename;
    }

    const updated = await StudentEntry.findByIdAndUpdate(entry._id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    console.error("❌ Update Entry Error:", err);
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
    console.error("❌ Delete Entry Error:", err);
    res.status(500).json({ message: "Failed to delete entry" });
  }
};
