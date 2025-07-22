import express from 'express';
import { createContactMessage, getAllContactMessages  } from '../controllers/contact/contactController.js';

const router = express.Router();


router.post('/', createContactMessage);
router.get("/contact-messages", getAllContactMessages);

// ✅ New endpoint for real-time count
router.get('/message-count', async (req, res) => {
  try {
    const count = await ContactMessage.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error('❌ Error counting messages:', err);
    res.status(500).json({ error: 'Failed to fetch message count' });
  }
})

export default router;
