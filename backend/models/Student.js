import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: { type: String, default: "" },
    course: { type: String, default: "" },
    yearLevel: { type: String, default: "" },
    profilePic: { type: String, default: "" },
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);
export default Student;
