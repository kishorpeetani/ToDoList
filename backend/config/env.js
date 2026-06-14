import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}` });

export const {
    PORT,
    DB_URI,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    CLIENT_URL,
    RESEND_API_KEY,
    MAIL_FROM,
} = process.env;