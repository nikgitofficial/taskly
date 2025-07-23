// utils/sendEmail.js
import nodemailer from "nodemailer";

const sendEmail = async (to, subject, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.OTP_EMAIL,
      pass: process.env.OTP_APP_PASSWORD,
    },
  });

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #2e7d32;">🔐 Taskly Password Reset</h2>
      <p>Hello,</p>
      <p>You recently requested to reset your password. Please use the OTP below to proceed:</p>
      <div style="margin: 20px 0; text-align: center;">
        <span style="font-size: 24px; font-weight: bold; color: #1a237e; letter-spacing: 4px;">${otp}</span>
      </div>
      <p>This OTP is valid for a limited time. If you didn't request a password reset, you can safely ignore this email.</p>
      <br>
      <p style="font-size: 14px; color: #555;">— Taskly Team</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Taskly Support" <${process.env.OTP_EMAIL}>`,
    to,
    subject,
    html: htmlContent,
  });
};

export default sendEmail;
