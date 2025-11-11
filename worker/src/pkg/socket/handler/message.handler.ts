import { useEffect } from "react";
import { getSocket } from "@/pkg/socket/socket";

export const useSocketMessages = (
  conversationId: string,
  onMessage: (msg: any) => void
) => {
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleReceiveMessage = (message: any) => {
      onMessage(message);
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [conversationId, onMessage]);
};
