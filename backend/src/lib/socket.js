import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ENV.CLIENT_URL,
    credentials: true,
  },
});

// Store online users: { userId: socketId }
const userSocketMap = {};

// Utility to get socketId by userId
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Apply authentication middleware
io.use(socketAuthMiddleware);

io.on("connection", (socket) => {
  const user = socket.user; // from middleware
  if (!user) return socket.disconnect();

  console.log("A user connected:", user.fullName);

  // Store socketId using _id as string
  userSocketMap[user._id.toString()] = socket.id;

  // Broadcast current online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Listen to chat events
  socket.on("send-message", (data) => {
    const receiverSocketId = getReceiverSocketId(data.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive-message", data);
    }
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected:", user.fullName);
    delete userSocketMap[user._id.toString()];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
