import { useEffect } from "react";
import { getSocket } from "../socket";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import type { NotificationInterface } from "@/pkg/interfaces/notification";

export const useSocketNoti = () => {
  const location = useLocation(); // Lấy đường dẫn hiện tại

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    if (!socket.connected) {
      socket.once("connect", () => {
        console.log("🟢 Connected to socket server - noti", socket?.id);
      });
    }

    const handleRefresh = (noti: NotificationInterface) => {
      // Bỏ qua nếu đang ở /messages
      if (location.pathname.startsWith("/messages")) return;

      if (noti) {
        switch (noti.type) {
          case "info":
            toast.info(noti.title);
            break;
          case "success":
            toast.success(noti.title);
            break;
          case "error":
            toast.error(noti.title);
            break;
          case "warning":
            toast.warning(noti.title);
            break;
        }
      }
    };

    socket.on("receive_notification", handleRefresh);

    return () => {
      socket.off("receive_notification", handleRefresh);
    };
  }, [location.pathname]); // watch location changes
};
