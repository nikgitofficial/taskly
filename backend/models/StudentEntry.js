// models/StudentEntry.js
import mongoose from "mongoose";

const studentEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: String,
    description: String,
    category: String,
    date: Date,
    done: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("StudentEntry", studentEntrySchema);
