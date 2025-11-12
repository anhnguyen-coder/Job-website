// socket/index.js
import { Server } from "socket.io";
import { verifySocketAuth } from "./middleware/authSocket.js";

let io;
const onlineUsers = new Map(); // key: userId (string), value: array of socketIds

export function setupSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use(verifySocketAuth);

  io.on("connection", (socket) => {
    const { id, role } = socket.user;
    const uid = id.toString(); // convert sang string

    if (!onlineUsers.has(uid)) onlineUsers.set(uid, []);
    onlineUsers.get(uid).push(socket.id);

    console.log(`🟢 ${role} ${uid} connected, socketId: ${socket.id}`);

    socket.on("join_conversation", (conversationId) => {
      socket.join(conversationId);
      console.log(`🟢 ${role} ${uid} joined conversation ${conversationId}`);
    });

    socket.on("disconnect", () => {
      const sockets = onlineUsers.get(uid) || [];
      onlineUsers.set(
        uid,
        sockets.filter((sId) => sId !== socket.id)
      );
      console.log(`🔴 ${role} ${uid} disconnected`);
    });
  });

  return io;
}

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};

export const getOnlineUsers = () => onlineUsers;
