import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";

const app = express(); // Express app for API & Socket
const server = http.createServer(app); // HTTP server

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: ENV.CLIENT_URL || "*", // allow your frontend
    credentials: true,
  },
});

// ===== Store online users =====
// userSocketMap: { userId: socketId }
const userSocketMap = {};

// Utility to get socketId by userId
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// ===== Apply authentication middleware =====
io.use(socketAuthMiddleware);

io.on("connection", (socket) => {
  const user = socket.user;
  if (!user) return socket.disconnect();

  console.log("A user connected:", user.fullName);

  // Store user socket
  userSocketMap[user._id.toString()] = socket.id;

  // Broadcast online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Listen for messages from client
  socket.on("send-message", (data) => {
    const receiverSocketId = getReceiverSocketId(data.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive-message", data);
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected:", user.fullName);
    delete userSocketMap[user._id.toString()];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
