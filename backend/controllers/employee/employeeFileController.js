// controllers/employeeFileController.js
import { put, del } from "@vercel/blob";
import axios from "axios";
import EmployeeFile from "../../models/EmployeeFile.js";

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    
    const description = req.body?.description || "";
    const { originalname, mimetype, buffer, size } = req.file;
    

    const blob = await put(originalname, buffer, {
      access: "public",
      contentType: mimetype,
      addRandomSuffix: true,
    });

    const newFile = new EmployeeFile({
      filename: blob.pathname,
      url: blob.url,
      userId: req.user.id,
      originalname,
      mimetype,
      size,
      description,
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
    const files = await EmployeeFile.find({ userId: req.user.id });
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const downloadFile = async (req, res) => {
  try {
    const file = await EmployeeFile.findById(req.params.id);
    if (!file || file.userId.toString() !== req.user.id)
      return res.status(404).json({ message: "File not found" });

    const response = await axios.get(file.url, { responseType: "stream" });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(file.originalname)}"`
    );
    res.setHeader("Content-Type", file.mimetype);

    response.data.pipe(res);
  } catch (err) {
    console.error("❌ Download stream error:", err.message);
    res.status(500).json({ message: "Download failed" });
  }
};

export const renameFile = async (req, res) => {
  try {
    const file = await EmployeeFile.findById(req.params.id);
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
    const file = await EmployeeFile.findById(req.params.id);
    if (!file || file.userId.toString() !== req.user.id)
      return res.status(404).json({ message: "File not found" });

    await del(file.filename);
    await EmployeeFile.findByIdAndDelete(file._id);
    res.json({ message: "File deleted" });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ message: err.message });
  }
};
