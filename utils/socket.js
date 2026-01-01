// utils/socket.js
import { io } from "socket.io-client";

let socket = null;

export const initSocket = (userId) => {
  if (typeof window === "undefined") return null; // SSR safe

  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3100", {
      extraHeaders: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "your_api_key" },
      autoConnect: false,
    });
  }

  // Attach persistent listeners (won’t duplicate)
  socket.off("connect");
  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
    if (userId) socket.emit("join", { userId });
  });

  socket.off("disconnect");
  socket.on("disconnect", (reason) => console.log("Socket disconnected:", reason));

  socket.off("connect_error");
  socket.on("connect_error", (err) => console.error("Socket error:", err.message));

  // Reconnect if disconnected
  if (!socket.connected) socket.connect();

  return socket;
};

export const getSocket = () => socket;
