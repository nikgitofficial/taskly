// models/Student.js
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: { type: String, required: true },
    course: { type: String, required: true },
    yearLevel: { type: String, required: true },
    profilePic: { type: String },
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);
export default Student;
