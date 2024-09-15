import nodemailer from "nodemailer";
import { config } from "dotenv";

config();

// Create a SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  service: "gmail",
  secure: false,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendMail = async (options) => {
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.text,
    // html: options.html,
  };

  if (options?.html) {
    mailOptions.html = options.html;
  } else if (options?.template) {
    mailOptions.template = options.template;
  }

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error?.message);
    throw new Error("Failed to send verification email.");
  }
};
