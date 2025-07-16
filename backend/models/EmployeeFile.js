import mongoose from "mongoose";

const employeeFileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  originalname: String,
  filename: String,
  mimetype: String,
  size: Number,
  url: String,
  fileUrl: String,
}, { timestamps: true });

export default mongoose.model("EmployeeFile", employeeFileSchema);
