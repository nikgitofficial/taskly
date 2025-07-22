import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false }, // ✅ New Field
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('ContactMessage', contactMessageSchema);
