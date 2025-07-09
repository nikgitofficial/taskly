import { put, del } from "@vercel/blob";
import formidable from "formidable";
import fs from "fs";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// ================== Upload Handler ==================
export const handleBlobUpload = async (req, res) => {
  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ message: "Parse error", err });

    const file = files.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    try {
      const stream = fs.createReadStream(file.filepath);

      const blob = await put(file.originalFilename, stream, {
        access: "public", // or "private"
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });

      res.status(200).json({
        message: "✅ Uploaded to Vercel Blob",
        url: blob.url,
        pathname: blob.pathname,
        name: file.originalFilename,
        size: file.size,
        type: file.mimetype,
      });
    } catch (uploadErr) {
      console.error("❌ Upload failed:", uploadErr);
      res.status(500).json({ message: "Upload failed", error: uploadErr });
    }
  });
};

// ================== Delete Handler ==================
export const handleBlobDelete = async (req, res) => {
  const { pathname } = req.params;

  try {
    await del(pathname, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    res.status(200).json({ message: "🗑️ File deleted" });
  } catch (error) {
    console.error("❌ Delete failed:", error);
    res.status(500).json({ message: "Delete failed", error });
  }
};

// ================== Rename Handler ==================
export const handleBlobRename = async (req, res) => {
  const { oldPathname } = req.params;
  const { newName } = req.body;

  try {
    const oldUrl = `https://blob.vercel-storage.com/${oldPathname}`;
    const response = await axios.get(oldUrl, { responseType: "stream" });

    const blob = await put(newName, response.data, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    await del(oldPathname, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    res.status(200).json({
      message: "✏️ File renamed",
      url: blob.url,
      pathname: blob.pathname,
      name: newName,
    });
  } catch (err) {
    console.error("❌ Rename failed:", err);
    res.status(500).json({ message: "Rename failed", error: err });
  }
};
