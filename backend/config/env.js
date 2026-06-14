import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}` });

export const {
    PORT,
    DB_URI,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    CLIENT_URL,
    EMAIL_PASS,
    EMAIL_USER
} = process.env;