import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (token: string): Socket => {
  // Reuse existing socket if already connected
  if (socket) return socket;

  socket = io(import.meta.env.VITE_API_URL, {
    auth: {
      token,
    },
    transports: ["websocket"],
  });

  // Optional dev-time logging (remove in prod)
  socket.on("connect", () => {
    console.log("🔌 Socket connected:", socket?.id);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected");
  });

  return socket;
};

export const disconnectSocket = (): void => {
  if (!socket) return;

  socket.disconnect();
  socket = null;
};

export const getSocket = (): Socket | null => socket;
