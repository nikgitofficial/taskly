// routes/testUpload.js
import express from "express";
import multer from "multer";
import { put } from "@vercel/blob";

const router = express.Router();
const upload = multer();

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const blob = await put(file.originalname, file.buffer, {
      access: "public", // or "private"
    });

    res.status(200).json({ url: blob.url });
  } catch (err) {
    console.error("❌ Vercel Blob upload error:", err.message);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

export default router;
