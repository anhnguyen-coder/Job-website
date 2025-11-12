import { Server } from "socket.io";
import { verifySocketAuth } from "./middleware/authSocket.js";

let io;
const onlineUsers = new Map(); // ✅ khai báo ở đây

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
    const { id, role } = socket.user;

    if (!onlineUsers.has(id)) {
      onlineUsers.set(id, []);
    }
    
    onlineUsers.get(id).push(socket.id);

    console.log(`🟢 ${role} ${id} connected, socketId: ${socket.id}`);

    socket.on("join_conversation", (conversationId) => {
      socket.join(conversationId);
      console.log(`🟢 ${role} ${id} joined conversation ${conversationId}`);
    });

    socket.on("disconnect", () => {
      const sockets = onlineUsers.get(id) || [];
      onlineUsers.set(
        id,
        sockets.filter((sId) => sId !== socket.id)
      );
      console.log(`🔴 ${role} ${id} disconnected`);
    });
  });

  return io;
}

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};
