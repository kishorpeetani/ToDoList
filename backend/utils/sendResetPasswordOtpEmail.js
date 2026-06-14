import { resend } from "./resendClient.js";
import { MAIL_FROM } from "../config/env.js";

export const sendResetPasswordOtpEmail = async (
  email,
  otp
) => {
  await resend.emails.send({
    from: MAIL_FROM,
    to: email,
    subject: "Reset Your Password",
    html: `
      <h2>Password Reset</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP expires in 5 minutes.</p>
    `,
  });
};