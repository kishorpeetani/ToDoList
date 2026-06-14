import { resend } from "./resendClient.js";
import { MAIL_FROM } from "../config/env.js";

export const sendOtpEmail = async (
  email,
  otp
) => {
  await resend.emails.send({
    from: MAIL_FROM,
    to: email,
    subject: "Todo List App - Verification Code",
    html: `
      <h2>Todo List App</h2>
      <p>Your verification code is:</p>
      <h1>${otp}</h1>
      <p>This code expires in 5 minutes.</p>
    `,
  });
};