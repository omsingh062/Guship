// server.js
import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";

// Resolve __dirname for ES Modules
const __dirname = path.resolve();

// Use platform PORT if available, else fallback to ENV.PORT or 3000
const PORT = process.env.PORT || ENV.PORT || 3000;

// Middleware
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

// Allow CORS only from frontend URL
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Serve frontend in production
if (ENV.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");

  app.use(express.static(frontendPath));

  // Catch all other routes and serve index.html
  app.get("*", (_, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// Start server and connect to DB
server.listen(PORT, async () => {
  console.log(`Server running on port: ${PORT}`);
  try {
    await connectDB();
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
});
