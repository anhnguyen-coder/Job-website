import { useEffect } from "react";
import { getSocket } from "@/pkg/socket/socket";

export const useSocketMessages = (
  conversationId: string,
  onMessage: (msg: any) => void
) => {
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    if (!socket.connected) {
      socket.once("connect", () => {
        console.log("🟢 Connected to socket server:", socket?.id);
      });
    }

    const handleReceiveMessage = (message: any) => {
      onMessage(message);
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [conversationId, onMessage]);
};

export const refreshListConv = (refresh: () => void) => {
  useEffect(() => {
    let socket = getSocket();
    if (!socket) return;

    const handleRefresh = () => {
      console.log("Refreshing...");
      refresh();
    };

    const attachListener = (sock: any) => {
      sock.on("refresh_list_conv", handleRefresh);
    };

    if (socket.connected) {
      attachListener(socket);
    } else {
      socket.once("connect", () => {
        console.log(
          "🟢 Connected to socket server - ready to refresh:",
          socket?.id
        );
        attachListener(socket);
      });
    }

    return () => {
      socket.off("refresh_list_conv", handleRefresh);
    };
  }, [refresh]);
};
