import dotenv from "dotenv";
dotenv.config();

import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import streamifier from "streamifier";

// ✅ Configure Cloudinary credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Disk-based upload storage (used for student profile pictures)
export const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "student-profiles",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

// ✅ Stream-based upload for general files (used in student entries)
export const streamUpload = (buffer, mimetype) => {
  return new Promise((resolve, reject) => {
    if (!buffer || !mimetype) {
      console.error("❌ Invalid file buffer or mimetype", { buffer, mimetype });
      return reject(new Error("Invalid file buffer or mimetype"));
    }

    const resourceType = mimetype === "application/pdf" ? "raw" : "auto";

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "studentry",
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) {
          console.error("❌ Cloudinary upload error:", error);
          return reject(error);
        }
        resolve(result);
      }
    );

    try {
      streamifier.createReadStream(buffer).pipe(stream);
    } catch (streamErr) {
      console.error("❌ Streamifier read stream failed:", streamErr);
      reject(streamErr);
    }
  });
};
