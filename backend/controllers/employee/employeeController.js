import Employee from "../models/Employee.js";

// GET employee profile
export const getEmployeeProfile = async (req, res) => {
  try {
    let employee = await Employee.findOne({ userId: req.user.id });
    if (!employee) {
      // Create an empty employee profile if not found (optional)
      employee = await Employee.create({ userId: req.user.id, name: "", department: "", position: "" });
      console.log("✅ New employee profile created");
    }
    res.json(employee);
  } catch (error) {
    console.error("❌ Error fetching employee profile:", error.message);
    res.status(500).json({ message: "Failed to fetch employee profile" });
  }
};

// UPDATE employee profile (support profilePic)
export const updateEmployeeProfile = async (req, res) => {
  try {
    const { name, department, position, profilePic } = req.body;

    if (!name || !department || !position) {
      return res.status(400).json({ message: "Name, department, and position are required." });
    }

    const updatedEmployee = await Employee.findOneAndUpdate(
      { userId: req.user.id },
      {
        name,
        department,
        position,
        ...(profilePic && { profilePic }),  // Update profilePic only if provided
      },
      { new: true, upsert: true }
    );

    res.json(updatedEmployee);
  } catch (error) {
    console.error("❌ Error updating employee profile:", error.message);
    res.status(500).json({ message: "Failed to update profile" });
  }
};
