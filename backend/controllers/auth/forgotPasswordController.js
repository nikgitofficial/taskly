// controllers/auth/forgotPasswordController.js
import User from "../../models/User.js";
import OTP from "../../models/OTP.js";
import sendEmail from "../../utils/sendEmail.js";
import bcrypt from "bcryptjs";

export const sendOTP = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await OTP.deleteMany({ email }); // Remove previous OTPs
  await OTP.create({ email, otp: otpCode, expiresAt });

  await sendEmail(email, "Taskly Password Reset OTP", `Your OTP is: ${otpCode}`);
  res.json({ message: "OTP sent to email" });
};

export const verifyOTPAndResetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const otpEntry = await OTP.findOne({ email, otp });
  if (!otpEntry || otpEntry.expiresAt < new Date()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  await OTP.deleteMany({ email }); // Clean up OTPs after reset

  res.json({ message: "Password reset successful" });
};
