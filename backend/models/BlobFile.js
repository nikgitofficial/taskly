// models/BlobFile.js
import mongoose from "mongoose";

const blobFileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    originalname: String,
    filename: String,
    mimetype: String,
    size: Number,
    url: String,
  },
  { timestamps: true }
);

const BlobFile = mongoose.model("BlobFile", blobFileSchema);
export default BlobFile;
