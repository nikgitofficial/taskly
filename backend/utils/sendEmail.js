// utils/sendEmail.js
import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
  // Create transporter with explicit SMTP settings
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,                  // use TLS
    auth: {
      user: process.env.OTP_EMAIL, // your Gmail address
      pass: process.env.OTP_APP_PASSWORD,  // your Gmail app password
    }
  });

  // Verify connection configuration
  try {
    await transporter.verify();
    console.log("✔️ SMTP connection successful");
  } catch (err) {
    console.error("❌ SMTP connection failed:", err);
    throw new Error("Email service configuration error");
  }

  // Mail options
  const mailOptions = {
    from: `"Taskly App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text
  };

  // Send mail
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Email sent:", info.messageId);
  } catch (err) {
    console.error("❌ sendMail error:", err);
    throw new Error("Failed to send email");
  }
};

export default sendEmail;
