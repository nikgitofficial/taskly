// routes/blobRoutes.js
import express from "express";
import multer from "multer";
import { put, del } from "@vercel/blob";
import axios from "axios";
import BlobFile from "../models/BlobFile.js";

const router = express.Router();
const upload = multer();

// ✅ UPLOAD FILE
router.post("/blob/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    const { url, pathname } = await put(file.originalname, file.buffer, {
      access: "public",
      addRandomSuffix: true,
    });

    const newBlobFile = new BlobFile({
      name: file.originalname,
      type: file.mimetype,
      size: file.size,
      url,
      pathname, // needed for delete/rename
    });

    await newBlobFile.save();
    res.status(201).json(newBlobFile);
  } catch (error) {
    console.error("❌ Blob upload error:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// ✅ GET ALL FILES
router.get("/blob/files", async (req, res) => {
  try {
    const files = await BlobFile.find().sort({ uploadedAt: -1 });
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch files" });
  }
});

// ✅ DELETE FILE (from Vercel + MongoDB)
router.delete("/blob/files/:id", async (req, res) => {
  try {
    const file = await BlobFile.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    await del(file.pathname, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    await BlobFile.findByIdAndDelete(req.params.id);
    res.json({ message: "🗑️ File deleted" });
  } catch (err) {
    console.error("❌ Delete failed:", err.message);
    res.status(500).json({ message: "Delete failed" });
  }
});

// ✅ RENAME FILE
router.put("/blob/files/:id", async (req, res) => {
  const { newName } = req.body;

  if (!newName) return res.status(400).json({ message: "New name is required" });

  try {
    const file = await BlobFile.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Use the full URL stored in DB, no need to construct oldUrl manually
    const response = await axios.get(file.url, { responseType: "arraybuffer" });

    const buffer = Buffer.from(response.data);

    const { url, pathname } = await put(newName, buffer, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    await del(file.pathname, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    file.name = newName;
    file.url = url;
    file.pathname = pathname;
    await file.save();

    res.json({ message: "✏️ File renamed", file });
  } catch (err) {
    console.error("❌ Rename failed:", err.response?.data || err.message);
    res.status(500).json({ message: "Rename failed" });
  }
});



export default router;
