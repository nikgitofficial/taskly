import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

/**
 * Send email with both plain text and styled HTML.
 *
 * @param {string} to - Recipient email
 * @param {string} subject - Subject of the email
 * @param {string} text - Fallback text message
 * @param {string} html - Optional HTML message
 */
const sendEmail = async (to, subject, text, html) => {
  const mailOptions = {
    from: `"Taskly Support" <${process.env.EMAIL}>`,
    to,
    subject,
    text,
    html: html || text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
};

export default sendEmail;
