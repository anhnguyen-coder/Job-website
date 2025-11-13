import { NotiItem } from "@/components/base/notiItem";
import { NotiSidebar } from "@/components/base/notiSideBar";
import type { NotificationInterface } from "@/pkg/interfaces/notification";
import { useState } from "react";

interface props {
  notifications: NotificationInterface[];
}

export const Notification = ({ notifications }: props) => {
  const [openNoti, setOpen] = useState(false);
  return (
    <div>
      {openNoti && (
        <NotiSidebar open={openNoti} onClose={() => setOpen(false)} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Notifications</h3>
        <button
          onClick={() => setOpen(true)}
          className="text-green-500 hover:text-green-700 hover:cursor-pointer font-medium transition-colors"
        >
          Show more
        </button>
      </div>

      {notifications.map((noti: NotificationInterface) => (
        <NotiItem noti={noti} key={noti._id} />
      ))}
    </div>
  );
};
