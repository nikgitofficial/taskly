import EmployeeTask from "../../models/EmployeeTask.js";

// ✅ Create Task
export const createTask = async (req, res) => {
  try {
    const { title, description, category, date, status } = req.body;
    const fileUrl = req.file ? req.file.path : null;
    const createdBy = req.user.id;

    const newTask = new EmployeeTask({ title, description, category, date, status, fileUrl, createdBy });
    await newTask.save();

    res.status(201).json({ message: "Task created successfully!", task: newTask });
  } catch (err) {
    res.status(500).json({ message: "Failed to create task", error: err.message });
  }
};

// ✅ Get All Tasks (by employee)
export const getTasks = async (req, res) => {
  try {
    const tasks = await EmployeeTask.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tasks", error: err.message });
  }
};

// ✅ Update Task
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
