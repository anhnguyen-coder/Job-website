import { Server } from "socket.io";
import { verifySocketAuth } from "./middleware/authSocket.js";

let io;

export function setupSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Xác thực trước khi connect
  io.use(verifySocketAuth);

  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.user?.id);

    // join theo userId
    socket.join(socket.user.id);

    socket.on("join_conversation", (conversationId) => {
      socket.join(conversationId);
      console.log(
        `🟢 ${socket.user.role} ${socket.user.id} joined conversation ${conversationId}`
      );
    });
  });

  return io;
}

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};
