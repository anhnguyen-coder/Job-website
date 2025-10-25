import { CUSTOMER_APP_THEME } from "@/constant/constant";
import { applyOpacity } from "@/pkg/helpers/style";
import { NOTI_TYPE } from "@/pkg/types/enums/noti";
import type { NotificationInterface } from "@/pkg/types/interfaces/notification";

interface Props {
  noti: NotificationInterface;
}

export function NotiItem({ noti }: Props) {
  const { color, icon } =
    notiStyleMap[noti.type] || notiStyleMap[NOTI_TYPE.INFO];

  return (
    <div
      className="group flex items-center mb-3 h-20 rounded-lg px-4 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg hover:-translate-y-1"
      style={{
        backgroundColor: applyOpacity(color, 0.12),
      }}
    >
      {/* Left color bar */}
      <div
        className="w-1 h-full mr-4 rounded-l-lg"
        style={{ backgroundColor: color }}
      ></div>

      {/* Icon + content */}
      <div className="flex items-start gap-3 w-full">
        <i
          className={`${icon} text-2xl transition-colors duration-300`}
          style={{ color }}
        ></i>
        <div className="flex-1">
          <p className="mb-1 font-semibold text-gray-900 group-hover:text-gray-800">
            {noti.title}
          </p>
          <p className="text-sm text-gray-600 line-clamp-1 group-hover:text-gray-700">
            {noti.content}
          </p>
        </div>
      </div>
    </div>
  );
}

// =========================
// CONFIG MAPS
// =========================
const notiStyleMap: Record<string, { color: string; icon: string }> = {
  [NOTI_TYPE.INFO]: {
    color: CUSTOMER_APP_THEME.COLOR.PRIMARY,
    icon: "mdi mdi-information-outline",
  },
  [NOTI_TYPE.SUCCESS]: {
    color: CUSTOMER_APP_THEME.COLOR.SECONDARY,
    icon: "mdi mdi-check-circle-outline",
  },
  [NOTI_TYPE.WARNING]: {
    color: CUSTOMER_APP_THEME.COLOR.WARNING,
    icon: "mdi mdi-alert-outline",
  },
  [NOTI_TYPE.ERROR]: {
    color: CUSTOMER_APP_THEME.COLOR.DANGER,
    icon: "mdi mdi-alert-circle-outline",
  },
};
