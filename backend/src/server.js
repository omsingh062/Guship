// backend/src/server.js

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url"; // ✅ Required for proper path resolution

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app as socketApp, server } from "./lib/socket.js";

const PORT = ENV.PORT || 3000;

// Middleware
socketApp.use(express.json({ limit: "5mb" }));
socketApp.use(cookieParser());
socketApp.use(cors({ origin: ENV.CLIENT_URL || "*", credentials: true }));

// API Routes
socketApp.use("/api/auth", authRoutes);
socketApp.use("/api/messages", messageRoutes);

// ✅ Serve Frontend in Production
if (ENV.NODE_ENV === "production") {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // ✅ Correct path to frontend/dist (works on Render)
  const frontendPath = path.join(__dirname, "../../frontend/dist");
  console.log("✅ Serving frontend from:", frontendPath);

  socketApp.use(express.static(frontendPath));

  socketApp.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// Start Server
server.listen(PORT, () => {
  console.log(`✅ Server running on port: ${PORT}`);
  connectDB();
});
