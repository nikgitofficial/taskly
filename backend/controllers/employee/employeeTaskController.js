import EmployeeTask from "../../models/EmployeeTask.js";

// ✅ Create Task
export const createTask = async (req, res) => {
  try {
    const { title, description, category, date, status } = req.body;
    const fileUrl = req.file ? req.file.path : null;
    const createdBy = req.user.id; // assuming auth middleware attaches user

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
