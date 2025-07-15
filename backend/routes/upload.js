import express from "express";
import multer from "multer";
import fetch from "node-fetch";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("profilePic"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const blobRes = await fetch("https://blob.vercel-storage.com/api/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
        "Content-Type": req.file.mimetype,
      },
      body: req.file.buffer,
    });

    if (!blobRes.ok) {
      const errorText = await blobRes.text();
      console.error("Vercel Blob upload error:", errorText);
      return res.status(500).json({ message: "Failed to upload to Vercel Blob" });
    }

    const blobData = await blobRes.json();

    res.json({ url: blobData.url });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed" });
  }
});

export default router;
