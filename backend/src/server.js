// backend/src/server.js
import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app as socketApp, server } from "./lib/socket.js";

// Use PORT from env or default 3000
const PORT = ENV.PORT || 3000;

// Middleware
socketApp.use(express.json({ limit: "5mb" }));
socketApp.use(cors({ origin: ENV.CLIENT_URL || "*", credentials: true }));
socketApp.use(cookieParser());

// API Routes
socketApp.use("/api/auth", authRoutes);
socketApp.use("/api/messages", messageRoutes);

// Serve frontend in production
if (ENV.NODE_ENV === "production") {
  const frontendDistPath = path.join(process.cwd(), "frontend", "dist");
  socketApp.use(express.static(frontendDistPath));

  // Always serve index.html for any non-API route
  socketApp.get("*", (_, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
  connectDB();
});
