import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

interface EnvVars {
  PORT: number;
  NODE_ENV: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  STRIPE_SECRET_KEY: string;
  PAYPAL_CLIENT_ID: string;
  PAYPAL_SECRET: string;
  WEBSOCKET_PORT: number;
  CURRENCY_API_KEY: string;
}

// Ensure required environment variables exist
const getEnv = (key: keyof EnvVars, defaultValue?: any): any => {
  const value = process.env[key];
  if (!value && defaultValue === undefined) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value || defaultValue;
};

// Export environment variables with type safety
export const env: EnvVars = {
  PORT: Number(getEnv("PORT", 5000)),
  NODE_ENV: getEnv("NODE_ENV", "development"),
  DB_HOST: getEnv("DB_HOST"),
  DB_PORT: Number(getEnv("DB_PORT", 5432)),
  DB_USER: getEnv("DB_USER"),
  DB_PASSWORD: getEnv("DB_PASSWORD"),
  DB_NAME: getEnv("DB_NAME"),
  JWT_SECRET: getEnv("JWT_SECRET"),
  JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN", "1d"),
  STRIPE_SECRET_KEY: getEnv("STRIPE_SECRET_KEY"),
  PAYPAL_CLIENT_ID: getEnv("PAYPAL_CLIENT_ID"),
  PAYPAL_SECRET: getEnv("PAYPAL_SECRET"),
  WEBSOCKET_PORT: Number(getEnv("WEBSOCKET_PORT", 6001)),
  CURRENCY_API_KEY: getEnv("CURRENCY_API_KEY"),
};
