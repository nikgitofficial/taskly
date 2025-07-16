import { put, del } from "@vercel/blob";
import EmployeeFile from "../models/EmployeeFile.js";

export const uploadEmployeeFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const { originalname, mimetype, buffer, size } = req.file;
    const blob = await put(originalname, buffer, {
      access: "public",
      contentType: mimetype,
      addRandomSuffix: true,
    });

    const newFile = await EmployeeFile.create({
      userId: req.user.id,
      originalname,
      filename: blob.pathname,
      mimetype,
      size,
      url: blob.url,
    });

    res.status(201).json(newFile);
  } catch (err) {
    console.error("❌ Employee Upload Error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getEmployeeFiles = async (req, res) => {
  try {
    const files = await EmployeeFile.find({ userId: req.user.id });
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteEmployeeFile = async (req, res) => {
  try {
    const file = await EmployeeFile.findById(req.params.id);
    if (!file || file.userId.toString() !== req.user.id)
      return res.status(404).json({ message: "File not found" });

    await del(file.filename);
    await file.deleteOne();
    res.json({ message: "File deleted" });
  } catch (err) {
    console.error("❌ Employee Delete Error:", err);
    res.status(500).json({ message: err.message });
  }
};
