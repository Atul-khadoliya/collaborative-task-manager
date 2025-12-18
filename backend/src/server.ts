import app from "./app";
import http from "http";
import { Server } from "socket.io";
import "dotenv/config";
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
  console.log("Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export io for later use
export { io };
