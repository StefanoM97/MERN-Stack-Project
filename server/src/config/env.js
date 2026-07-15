import dotenv from "dotenv";

dotenv.config({ quiet: true });

const nodeEnv = process.env.NODE_ENV || "development";
const isTest = nodeEnv === "test";

function required(name, fallback = "") {
  const value = process.env[name] || fallback;
  if (nodeEnv === "production" && !value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv,
  isProduction: nodeEnv === "production",
  isTest,
  port: Number(process.env.PORT || 5000),
  appUrl: process.env.APP_URL || "http://localhost:5173",
  allowedOrigins: (process.env.ALLOWED_ORIGINS || process.env.APP_URL || "http://localhost:5173")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
  mongoUri: required("MONGODB_URI", isTest ? "mongodb://127.0.0.1:27017/reusehub_test" : ""),
  jwtSecret: required(
    "JWT_SECRET",
    isTest ? "test-secret-that-is-long-enough-for-reusehub-tests" : ""
  ),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  cookieName: process.env.COOKIE_NAME || "reusehub_token",
  cookieSecure: process.env.COOKIE_SECURE === "true",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  smtp: {
    host: process.env.SMTP_HOST || "",
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    from: process.env.EMAIL_FROM || "ReuseHub <no-reply@example.com>"
  },
  ebay: {
    clientId: process.env.EBAY_CLIENT_ID || "",
    clientSecret: process.env.EBAY_CLIENT_SECRET || "",
    marketplaceId: process.env.EBAY_MARKETPLACE_ID || "EBAY_US"
  },
  youtubeApiKey: process.env.YOUTUBE_API_KEY || ""
};
