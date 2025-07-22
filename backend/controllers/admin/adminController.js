// controllers/adminController.js
import User from "../../models/User.js";
import Student from "../../models/Student.js";
import Employee from "../../models/Employee.js";
import StudentFile from "../../models/StudentFile.js";
import StudentEntry from "../../models/StudentEntry.js";
import EmployeeFile from "../../models/EmployeeFile.js";
import EmployeeTask from "../../models/EmployeeTask.js";

export const getDashboardSummary = async (req, res) => {
  try {
    const users = await User.find({}, "_id email role");

    const data = await Promise.all(users.map(async (user) => {
      let name = "Unnamed User";

      if (user.role === "student") {
        const student = await Student.findOne({ userId: user._id });
        if (student?.name) name = student.name;
      } else if (user.role === "employee") {
        const employee = await Employee.findOne({ userId: user._id });
        if (employee?.name) name = employee.name;
      }

      let fileCount = 0;
      if (user.role === "student") {
        fileCount = await StudentFile.countDocuments({ userId: user._id });
      } else if (user.role === "employee") {
        fileCount = await EmployeeFile.countDocuments({ userId: user._id });
      }

      let entryCount = 0;
      if (user.role === "student") {
        entryCount = await StudentEntry.countDocuments({ userId: user._id });
      } else if (user.role === "employee") {
        entryCount = await EmployeeTask.countDocuments({ createdBy: user._id });
      }

      return {
        userId: user._id,
        name,
        email: user.email,
        role: user.role,
        fileCount,
        entryCount,
      };
    }));

    const totalUsers = await User.countDocuments();
    const totalStudentFiles = await StudentFile.countDocuments();
    const totalEmployeeFiles = await EmployeeFile.countDocuments();
    const totalFiles = totalStudentFiles + totalEmployeeFiles;

    const totalStudentEntries = await StudentEntry.countDocuments();
    const totalEmployeeTasks = await EmployeeTask.countDocuments();
    const totalEntries = totalStudentEntries + totalEmployeeTasks;

    res.json({
      users: data,
      totalUsers,
      totalFiles,
      totalEntries,
    });
  } catch (err) {
    console.error("❌ Admin Dashboard Error:", err);
    res.status(500).json({ message: "Failed to load dashboard data" });
  }
};


export const getUserDetails = async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id).select("_id email role");
  if (!user) return res.status(404).json({ message: "User not found" });

  let profile = {};
  let name = "Unnamed User";

  if (user.role === "student") {
    const student = await Student.findOne({ userId: id });
    if (student) {
      profile = student.toObject();
      name = student.name;
    }
  } else if (user.role === "employee") {
    const employee = await Employee.findOne({ userId: id });
    if (employee) {
      profile = employee.toObject();
      name = employee.name;
    }
  }

  return res.json({ ...user.toObject(), name, ...profile });
};
