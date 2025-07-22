import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  name: { type: String },
  department: { type: String },
  position: { type: String },
  profilePic: { type: String }
}, { timestamps: true });

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
