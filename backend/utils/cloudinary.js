import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer storage
export const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "student_profiles",
    format: async (req, file) => "jpg", // you can keep original or force jpg
    public_id: (req, file) => `student_${req.user.id}`,
  },
});

export default cloudinary;
