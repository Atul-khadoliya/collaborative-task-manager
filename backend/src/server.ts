import app from "./app";
import http from "http";
import { Server } from "socket.io";
import { verifyToken } from "./utils/jwt";

import "dotenv/config";
const userSocketMap = new Map<string, string>();

const PORT = process.env.PORT || 5000;
console.log("DATABASE_URL =", process.env.DATABASE_URL);

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Basic connection check
io.on("connection", (socket) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) {
      console.log("❌ Socket connection without token");
      socket.disconnect();
      return;
    }

    const payload = verifyToken(token); // must return { userId: string }
    const userId = payload.userId;

    userSocketMap.set(userId, socket.id);

    console.log(`🔌 User ${userId} connected with socket ${socket.id}`);

    socket.on("disconnect", () => {
      userSocketMap.delete(userId);
      console.log(`❌ User ${userId} disconnected`);
    });
  } catch (err) {
    console.log("❌ Invalid socket token");
    socket.disconnect();
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export io for later use
export const emitToUser = (
  userId: string,
  event: string,
  payload: any
) => {
  const socketId = userSocketMap.get(userId);

  if (!socketId) {
    // User is offline — silently ignore
    return;
  }

  io.to(socketId).emit(event, payload);
};

