// routes/testUpload.js
import express from "express";
import { upload } from "../middleware/upload.js";
import { streamUpload } from "../utils/cloudinary.js";

const router = express.Router();

router.post("/test-upload", upload.single("file"), async (req, res) => {
  console.log("📥 Incoming file upload test...");
  console.log("➡️ req.file:", req.file);

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const result = await streamUpload(req.file.buffer, req.file.mimetype);
    console.log("✅ Cloudinary Upload Success:", result);
    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
});

export default router;
