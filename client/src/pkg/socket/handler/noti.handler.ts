import { useEffect } from "react";
import { getSocket } from "../socket";
import type { NotificationInterface } from "@/pkg/types/interfaces/notification";
import { toast } from "react-toastify";

export const useSocketNoti = () => {
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    if (!socket.connected) {
      socket.once("connect", () => {
        console.log("🟢 Connected to socket server - noti", socket?.id);
      });
    }

    const handleRefresh = (noti: NotificationInterface) => {
      console.log(noti);
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
  }, []);
};
