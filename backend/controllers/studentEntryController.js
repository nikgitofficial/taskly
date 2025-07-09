import StudentEntry from "../models/StudentEntry.js";

// ✅ CREATE ENTRY
export const createEntry = async (req, res) => {
  try {
    const { title, description, category, date } = req.body;

    const newEntry = new StudentEntry({
      userId: req.user.id,
      title,
      description,
      category,
      date,
      done: false,
    });

    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (error) {
    console.error("❌ Error creating entry:", error);
    res.status(500).json({
      message: "Server error while creating entry",
      error: error.message,
    });
  }
};

// ✅ GET ENTRIES
export const getEntries = async (req, res) => {
  try {
    const entries = await StudentEntry.find({ userId: req.user.id }).sort({ date: 1 });
    res.json(entries);
  } catch (error) {
    console.error("❌ Error fetching entries:", error);
    res.status(500).json({ message: "Server error while fetching entries" });
  }
};

// ✅ UPDATE ENTRY
export const updateEntry = async (req, res) => {
  try {
    const entry = await StudentEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Entry not found" });
    if (entry.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    const { title, description, category, date, done } = req.body;

    if (title !== undefined) entry.title = title;
    if (description !== undefined) entry.description = description;
    if (category !== undefined) entry.category = category;
    if (date !== undefined) entry.date = date;
    if (done !== undefined) entry.done = done;

    await entry.save();
    res.json(entry);
  } catch (error) {
    console.error("❌ Error updating entry:", error);
    res.status(500).json({
      message: "Server error while updating entry",
      error: error.message,
    });
  }
};

// ✅ DELETE ENTRY
export const deleteEntry = async (req, res) => {
  try {
    const entry = await StudentEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Entry not found" });
    if (entry.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    await entry.deleteOne();
    res.json({ message: "Entry deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting entry:", error);
    res.status(500).json({
      message: "Server error while deleting entry",
      error: error.message,
    });
  }
};
