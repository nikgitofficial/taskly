import Student from "../../models/Student.js";

// ✅ GET Student Profile
export const getStudentProfile = async (req, res) => {
  try {
    let student = await Student.findOne({ userId: req.user.id });
    if (!student) {
      student = await Student.create({ userId: req.user.id });
      console.log("✅ New student profile created");
    }
    res.json(student);
  } catch (error) {
    console.error("❌ Error fetching student profile:", error.message);
    res.status(500).json({ message: "Failed to fetch student profile" });
  }
};

// ✅ UPDATE Student Profile with profilePic support
export const updateStudentProfile = async (req, res) => {
  try {
    const { name, course, yearLevel, profilePic } = req.body;

    if (!name || !course || !yearLevel) {
      return res.status(400).json({ message: "Name, course, and year level are required." });
    }

    const updatedStudent = await Student.findOneAndUpdate(
      { userId: req.user.id },
      {
        name,
        course,
        yearLevel,
        ...(profilePic && { profilePic }), // ✅ Only update profilePic if provided
      },
      { new: true, upsert: true }
    );

    res.json(updatedStudent);
  } catch (error) {
    console.error("❌ Error updating student profile:", error.message);
    res.status(500).json({ message: "Failed to update profile" });
  }
};
