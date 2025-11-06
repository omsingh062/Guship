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

// --- Middleware ---
socketApp.use(express.json({ limit: "5mb" }));
socketApp.use(cookieParser());

// --- CORS Setup ---
const allowedOrigins = [
  "http://localhost:5173",                  // local dev
  ENV.CLIENT_URL,                           // deployed frontend
];

socketApp.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("Blocked CORS for:", origin);
        callback(new Error(`CORS not allowed for origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// --- API Routes ---
socketApp.use("/api/auth", authRoutes);
socketApp.use("/api/messages", messageRoutes);

// --- Serve Frontend in Production ---
if (ENV.NODE_ENV === "production") {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const frontendPath = path.join(__dirname, "../../frontend/dist");

  console.log("✅ Serving frontend from:", frontendPath);

  socketApp.use(express.static(frontendPath));

  // Catch-all for client-side routes
  socketApp.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// --- Start Server ---
server.listen(PORT, () => {
  console.log(`✅ Server running on port: ${PORT}`);
  connectDB();
});
