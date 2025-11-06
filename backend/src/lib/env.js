import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/guship",
  JWT_SECRET: process.env.JWT_SECRET || "supersecretkey",
  CLIENT_URL: (
    process.env.NODE_ENV === "production"
      ? `https://${(process.env.RENDER_EXTERNAL_HOSTNAME || "guships.onrender.com").trim()}`
      : process.env.CLIENT_URL || "http://localhost:5173"
  ).trim(),
  RESEND_API_KEY: process.env.RESEND_API_KEY || "",
  EMAIL_FROM: process.env.EMAIL_FROM || "",
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME || "",
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
  ARCJET_KEY: process.env.ARCJET_KEY || "",
  ARCJET_ENV: process.env.ARCJET_ENV || "development",
};
