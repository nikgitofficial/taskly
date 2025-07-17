// models/StudentFile.js
import mongoose from "mongoose";

const employeeFileSchema = new mongoose.Schema(
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

const EmployeeFile = mongoose.model("EmployeeFile", employeeFileSchema);
export default EmployeeFile;
