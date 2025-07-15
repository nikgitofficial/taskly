// controllers/blobUploadController.js
import { put, del } from "@vercel/blob";
import BlobFile from "../../models/BlobFile.js";

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { originalname, mimetype, buffer, size } = req.file;

    const blob = await put(originalname, buffer, {
      access: "public",
      contentType: mimetype,
      addRandomSuffix: true,
    });

    const newFile = new BlobFile({
      filename: blob.pathname,
      url: blob.url,
      userId: req.user.id,
      originalname,
      mimetype,
      size,
    });

    await newFile.save();
    res.status(201).json(newFile);
  } catch (err) {
    console.error("❌ Blob upload error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getUserFiles = async (req, res) => {
  try {
    const files = await BlobFile.find({ userId: req.user.id });
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const downloadFile = async (req, res) => {
  try {
    const file = await BlobFile.findById(req.params.id);
    if (!file || file.userId.toString() !== req.user.id)
      return res.status(404).json({ message: "File not found" });

    // Stream the blob file from its public URL
    const response = await axios.get(file.url, { responseType: "stream" });

    // Set correct headers to force download
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(file.originalname)}"`);
    res.setHeader("Content-Type", file.mimetype);

    // Pipe blob stream to response
    response.data.pipe(res);
  } catch (err) {
    console.error("❌ Download stream error:", err.message);
    res.status(500).json({ message: "Download failed" });
  }
};


export const renameFile = async (req, res) => {
  try {
    const file = await BlobFile.findById(req.params.id);
    if (!file || file.userId.toString() !== req.user.id)
      return res.status(404).json({ message: "File not found" });

    file.originalname = req.body.newName;
    await file.save();
    res.json(file);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteFile = async (req, res) => {
  try { 
    const file = await BlobFile.findById(req.params.id);
    if (!file || file.userId.toString() !== req.user.id)
      return res.status(404).json({ message: "File not found" });

    await del(file.filename);
    await BlobFile.findByIdAndDelete(file._id);
    res.json({ message: "File deleted" });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ message: err.message });
  }
};
