import { NotiItem } from "@/components/base/notiItem";
import type { NotificationInterface } from "@/pkg/types/interfaces/notification";

interface props {
  notifications: NotificationInterface[];
}

export const Notification = ({ notifications }: props) => {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Notifications</h3>
        <button className="text-green-500 hover:text-green-700 hover:cursor-pointer font-medium transition-colors">
          Show more
        </button>
      </div>

      {notifications.map((noti: NotificationInterface) => (
        <NotiItem noti={noti} key={noti._id} />
      ))}
    </div>
  );
};
