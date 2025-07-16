import mongoose from "mongoose";

const EmployeeTaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
  date: { type: Date, required: true },
  fileUrl: { type: String }, // optional file storage (URL or path)
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // tracks who submitted the task
}, { timestamps: true });

export default mongoose.model("EmployeeTask", EmployeeTaskSchema);
