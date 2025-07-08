// middleware/upload.js
import multer from "multer";

// ✅ Use memory storage to access file.buffer (needed for stream upload to Cloudinary)
const storage = multer.memoryStorage();

export const upload = multer({ storage });
