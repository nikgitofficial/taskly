  // controllers/studentEntryController.js
import StudentEntry from "../../models/StudentEntry.js";

// @desc    Create a new entry
// @route   POST /api/entries
// @access  Private
export const createEntry = async (req, res) => {
  try {
    const { title, description, category, date } = req.body;

    const entry = new StudentEntry({
      userId: req.user.id,
      title,
      description,
      category,
      date,
    });

    const saved = await entry.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error creating entry:", err);
    res.status(500).json({ message: "Failed to create entry" });
  }
};

// @desc    Get all entries for the logged-in user
// @route   GET /api/entries
// @access  Private
export const getEntries = async (req, res) => {
  try {
    const entries = await StudentEntry.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(entries);
  } catch (err) {
    console.error("Error fetching entries:", err);
    res.status(500).json({ message: "Failed to fetch entries" });
  }
};

// @desc    Update an entry
// @route   PUT /api/entries/:id
// @access  Private
export const updateEntry = async (req, res) => {
  try {
    const updated = await StudentEntry.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Entry not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Error updating entry:", err);
    res.status(500).json({ message: "Failed to update entry" });
  }
};

// @desc    Delete an entry
// @route   DELETE /api/entries/:id
// @access  Private
export const deleteEntry = async (req, res) => {
  try {
    const deleted = await StudentEntry.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Entry not found" });
    }

    res.json({ message: "Entry deleted successfully" });
  } catch (err) {
    console.error("Error deleting entry:", err);
    res.status(500).json({ message: "Failed to delete entry" });
  }
};
