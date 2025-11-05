// backend/src/server.js
import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app as ioApp, server } from "./lib/socket.js";

const __dirname = path.resolve();

// Use port from environment (Render) or 3000 locally
const PORT = ENV.PORT || 3000;

// ===== Middleware =====
ioApp.use(express.json({ limit: "5mb" }));
ioApp.use(cors({ origin: ENV.CLIENT_URL || "http://localhost:5173", credentials: true }));
ioApp.use(cookieParser());

// ===== Routes =====
ioApp.use("/api/auth", authRoutes);
ioApp.use("/api/messages", messageRoutes);

// ===== Serve Frontend in Production =====
if (ENV.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../../frontend/dist");
  ioApp.use(express.static(frontendPath));

  ioApp.get("*", (_, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// ===== Start Server =====
server.listen(PORT, async () => {
  console.log(`Server running on port: ${PORT}`);
  await connectDB();
});
