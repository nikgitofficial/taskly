// controllers/adminController.js
import User from "../../models/User.js";
import StudentFile from "../../models/StudentFile.js";
import StudentEntry from "../../models/StudentEntry.js";

export const getDashboardSummary = async (req, res) => {
  try {
    const users = await User.find({}, "_id name email role");

    const data = await Promise.all(users.map(async (user) => {
      const fileCount = await StudentFile.countDocuments({ userId: user._id });
      const entryCount = await StudentEntry.countDocuments({ userId: user._id });

      return {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        fileCount,
        entryCount
      };
    }));

    res.json(data);
  } catch (err) {
    console.error("❌ Admin Dashboard Error:", err);
    res.status(500).json({ message: "Failed to load dashboard data" });
  }
};
