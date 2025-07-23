import User from "../../models/User.js";
import OTP from "../../models/OTP.js";
import sendEmail from "../../utils/sendEmail.js";
import bcrypt from "bcryptjs";

// @desc Send OTP to user's email
// @route POST /api/auth/send-otp
// @access Public
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await OTP.deleteMany({ email }); // Clear previous OTPs
    await OTP.create({ email, otp: otpCode, expiresAt });

    const emailMessage = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
        <h2 style="color: #333;">Taskly Password Reset OTP</h2>
        <p>Hi ${user.name || "User"},</p>
        <p>You recently requested to reset your Taskly password.</p>
        <p><strong>Your OTP is:</strong></p>
        <div style="font-size: 24px; font-weight: bold; color: #007bff;">${otpCode}</div>
        <p>This code is valid for <strong>10 minutes</strong>. Do not share this code with anyone.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <br />
        <p style="color: #888;">– The Taskly Team</p>
      </div>
    `;

    await sendEmail(email, "Taskly Password Reset OTP", emailMessage);

    res.status(200).json({ message: "OTP sent to your email." });

  } catch (err) {
    console.error("Send OTP Error:", err);
    res.status(500).json({ message: "Server error while sending OTP." });
  }
};

// @desc Verify OTP and reset password
// @route POST /api/auth/reset-password
// @access Public
export const verifyOTPAndResetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const otpEntry = await OTP.findOne({ email, otp });
    if (!otpEntry || otpEntry.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    await OTP.deleteMany({ email }); // Clear OTPs after success

    res.status(200).json({ message: "Password has been reset successfully." });

  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ message: "Server error while resetting password." });
  }
};
