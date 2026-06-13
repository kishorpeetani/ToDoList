import nodemailer from "nodemailer";
import {
  EMAIL_USER,
  EMAIL_PASS,
} from "../config/env.js";

const transporter =
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

export const sendOtpEmail = async (
  email,
  otp
) => {
  try {
    await transporter.sendMail({
      from: EMAIL_USER,
      to: email,
      subject: "Todo List App - Verification Code",

      text: `Your verification code is ${otp}. It expires in 5 minutes.`,

      html: `
          <div style="font-family: Arial, sans-serif;">
            <h2>Todo List App</h2>

            <p>Hello,</p>

            <p>Your verification code is:</p>

            <h1>${otp}</h1>

            <p>This code expires in 5 minutes.</p>

            <p>If you didn't request this code, please ignore this email.</p>
          </div>
        `
    });

  } catch (error) {
    console.error("Mail Error:", error);
    throw error;
  }
};