import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app as socketApp, server } from "./lib/socket.js";

const PORT = ENV.PORT || 3000;

// ----------------- MIDDLEWARE -----------------
socketApp.use(express.json({ limit: "5mb" }));
socketApp.use(cookieParser());

// CORS: allow local dev + deployed frontend
socketApp.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        ENV.CLIENT_URL, // local dev, e.g., http://localhost:5173
        "https://guship-hut8-9xoylcq44-omsingh062s-projects.vercel.app" // Vercel frontend
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true, // allow cookies/auth headers
  })
);

// ----------------- API ROUTES -----------------
socketApp.use("/api/auth", authRoutes);
socketApp.use("/api/messages", messageRoutes);

// ----------------- SERVE FRONTEND -----------------
if (ENV.NODE_ENV === "production") {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const frontendPath = path.join(__dirname, "../../frontend/dist");

  console.log("✅ Serving frontend from:", frontendPath);

  socketApp.use(express.static(frontendPath));
  socketApp.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// ----------------- START SERVER -----------------
server.listen(PORT, () => {
  console.log(`✅ Server running on port: ${PORT}`);
  connectDB();
});
