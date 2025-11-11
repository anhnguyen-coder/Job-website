import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = () => {
  if (!socket) {
    socket = io("http://localhost:3000", {
      withCredentials: true,
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("🟢 Connected to socket server:", socket?.id);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected from socket server");
    });
  }

  return socket;
};

export const getSocket = () => socket;
