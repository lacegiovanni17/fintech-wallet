import * as dotenv from "dotenv";
dotenv.config();

if (!process.env.DB_PASS) throw new Error("DB_PASS is missing in .env");
if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is missing in .env");
if (!process.env.GOOGLE_CLIENT_ID) throw new Error("GOOGLE_CLIENT_ID is missing in .env");
if (!process.env.GOOGLE_CLIENT_SECRET) throw new Error("GOOGLE_CLIENT_SECRET is missing in .env");
if (!process.env.FRONTEND_URL) throw new Error("FRONTEND_URL is missing in .env");

export const env = {
  db: {
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT || "5432"),
    user: process.env.DB_USER!,
    pass: process.env.DB_PASS!,
    name: process.env.DB_NAME!,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET!,
    googleClientId: process.env.GOOGLE_CLIENT_ID!,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    frontendUrl: process.env.FRONTEND_URL!,
  },
};
