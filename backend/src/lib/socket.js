import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [ENV.CLIENT_URL],
    credentials: true,
  },
});

// Apply authentication middleware
io.use(socketAuthMiddleware);

// Store online users: { userId: socketId }
const userSocketMap = {};

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  const userId = socket.userId;
  const fullName = socket.user.fullName;

  // If user already connected, disconnect old socket
  if (userSocketMap[userId] && userSocketMap[userId] !== socket.id) {
    const oldSocketId = userSocketMap[userId];
    const oldSocket = io.sockets.sockets.get(oldSocketId);
    if (oldSocket) {
      oldSocket.disconnect(true);
      console.log(`Disconnected old socket for user: ${fullName}`);
    }
  }

  // Save current socket
  userSocketMap[userId] = socket.id;
  console.log("A user connected", fullName);

  // Broadcast online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", fullName);
    // Only delete if the disconnecting socket matches
    if (userSocketMap[userId] === socket.id) {
      delete userSocketMap[userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
