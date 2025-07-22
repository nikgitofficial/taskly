// controllers/contact/contactController.js
import ContactMessage from '../../models/ContactMessage.js';

export const createContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ msg: "All fields are required." });
    }

    const newMessage = new ContactMessage({ name, email, message });
    await newMessage.save();

    res.status(201).json({ msg: "Message sent successfully!" });
  } catch (error) {
    console.error("Contact submission error:", error);
    res.status(500).json({ msg: "Server error." });
  }
};

// ✅ Updated: mark all unread as read after fetching
export const getAllContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });

    await ContactMessage.updateMany({ isRead: false }, { isRead: true });

    res.status(200).json(messages);
  } catch (error) {
    console.error("❌ Error fetching messages:", error);
    res.status(500).json({ msg: "Server error fetching messages." });
  }
};

// ✅ Only count unread messages
export const getContactMessageCount = async (req, res) => {
  try {
    const count = await ContactMessage.countDocuments({ isRead: false });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Failed to get message count" });
  }
};
