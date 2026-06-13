import nodemailer from "nodemailer";
import {
  EMAIL_USER,
  EMAIL_PASS,
} from "../config/env.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export const sendResetPasswordOtpEmail = async (
  email,
  otp
) => {
  await transporter.sendMail({
    from: EMAIL_USER,
    to: email,
    subject: "Reset Your Password",
    html: `
      <h2>Password Reset</h2>
      <p>Your password reset OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP expires in 5 minutes.</p>
    `,
  });
};