import { put } from "@vercel/blob";
import EmployeeTask from "../../models/EmployeeTask.js";

// ✅ Create Task with optional file upload
export const createTask = async (req, res) => {
  try {
    const { title, description, category, date, status } = req.body;
    const createdBy = req.user.id;
    let fileUrl = null;

    if (req.file) {
      const { buffer, originalname, mimetype } = req.file;
      const blob = await put(originalname, buffer, {
        access: "public",
        contentType: mimetype,
        addRandomSuffix: true,
      });
      fileUrl = blob.url;
    }

    const newTask = new EmployeeTask({
      title,
      description,
      category,
      date,
      status,
      createdBy,
      fileUrl,
    });

    await newTask.save();
    res.status(201).json({ message: "Task created successfully!", task: newTask });
  } catch (err) {
    console.error("❌ Failed to create task:", err.message);
    res.status(500).json({ message: "Failed to create task", error: err.message });
  }
};

// ✅ Get All Tasks for logged-in user
export const getTasks = async (req, res) => {
  try {
    const tasks = await EmployeeTask.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tasks", error: err.message });
  }
};

// ✅ Update Task (file remains unchanged)
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, date, status } = req.body;

    const task = await EmployeeTask.findOneAndUpdate(
      { _id: id, createdBy: req.user.id },
      { title, description, category, date, status },
      { new: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found or unauthorized" });

    res.json({ message: "Task updated successfully!", task });
  } catch (err) {
    res.status(500).json({ message: "Failed to update task", error: err.message });
  }
};

// ✅ Delete Task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await EmployeeTask.findOneAndDelete({ _id: id, createdBy: req.user.id });

    if (!task) return res.status(404).json({ message: "Task not found or unauthorized" });

    res.json({ message: "Task deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete task", error: err.message });
  }
};
