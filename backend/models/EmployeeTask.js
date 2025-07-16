import mongoose from "mongoose";

const EmployeeTaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // consistent with your other models
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
  date: { type: Date, required: true },
  fileUrl: { type: String }, // ✅ optional file storage (URL or path)
}, { timestamps: true });

export default mongoose.model("EmployeeTask", EmployeeTaskSchema);
