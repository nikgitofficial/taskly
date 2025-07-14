import Student from "../models/Student.js";

export const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) {
      // Auto-create student profile if not found (optional)
      const newStudent = await Student.create({ userId: req.user.id });
      return res.json(newStudent);
    }
    res.json(student);
  } catch (error) {
    console.error("❌ Error fetching student profile:", error.message);
    res.status(500).json({ message: "Failed to fetch student profile" });
  }
};

export const updateStudentProfile = async (req, res) => {
  try {
    const { name, course, yearLevel } = req.body;
    if (!name || !course || !yearLevel) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updated = await Student.findOneAndUpdate(
      { userId: req.user.id },
      { name, course, yearLevel },
      { new: true, upsert: true }
    );

    res.json(updated);
  } catch (error) {
    console.error("❌ Error updating student profile:", error.message);
    res.status(500).json({ message: "Failed to update profile" });
  }
};
