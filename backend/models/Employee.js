import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    name: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    profilePic: { type: String, default: "" }  // Added for profile picture URL
  },
  { timestamps: true }
);

export default mongoose.model("Employee", employeeSchema);
