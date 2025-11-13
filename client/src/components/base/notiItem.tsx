import { useRef, useState } from "react";
import { CUSTOMER_APP_THEME } from "@/constant/constant";
import { applyOpacity } from "@/pkg/helpers/style";
import { NOTI_TYPE } from "@/pkg/types/enums/noti";
import type { NotificationInterface } from "@/pkg/types/interfaces/notification";
import { ConfirmModal } from "./confirmModal";

interface Props {
  noti: NotificationInterface;
  handleMakeReadNoti?: (id: string, isLoadMore?: boolean) => void;
  handleDeleteNoti?: (id: string) => void;
}

export function NotiItem({
  noti,
  handleMakeReadNoti,
  handleDeleteNoti,
}: Props) {
  const [openModalConfirm, setOpenModalConfirm] = useState(false);

  const { color, icon } =
    notiStyleMap[noti.type] || notiStyleMap[NOTI_TYPE.INFO];

  // trạng thái swipe
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // trạng thái expand
  const [isExpanded, setIsExpanded] = useState(false);

  const startX = useRef(0);
  const movedDistance = useRef(0);
  const animationRef = useRef<number>(0);

  const MAX_SWIPE = -120;
  const SNAP_POINT = -60;
  const CLICK_THRESHOLD = 10; // ngưỡng để phân biệt click và swipe

  const handleStart = (x: number) => {
    startX.current = x;
    movedDistance.current = 0;
    setIsDragging(true);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  const handleMove = (x: number) => {
    if (!isDragging) return;
    const diff = x - startX.current;
    movedDistance.current = Math.abs(diff);

    let nextX = diff;
    if (isOpen) nextX = diff - MAX_SWIPE;
    nextX = Math.min(0, Math.max(nextX, MAX_SWIPE));
    setTranslateX(nextX);
  };

  const animateTo = (target: number) => {
    const step = () => {
      setTranslateX((prev) => {
        const delta = (target - prev) * 0.2;
        const newX = prev + delta;
        if (Math.abs(target - newX) < 0.5) {
          cancelAnimationFrame(animationRef.current!);
          return target;
        }
        animationRef.current = requestAnimationFrame(step);
        return newX;
      });
    };
    animationRef.current = requestAnimationFrame(step);
  };

  const handleEnd = () => {
    setIsDragging(false);

    // Nếu người dùng kéo xa hơn SNAP_POINT => mở
    if (translateX < SNAP_POINT) {
      setIsOpen(true);
      animateTo(MAX_SWIPE);
    } else {
      setIsOpen(false);
      animateTo(0);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => handleStart(e.clientX);
  const handleMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const handleMouseUp = handleEnd;
  const handleTouchStart = (e: React.TouchEvent) =>
    handleStart(e.touches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) =>
    handleMove(e.touches[0].clientX);
  const handleTouchEnd = handleEnd;

  // ✅ chỉ mở khi thực sự click (không kéo)
  const handleClick = () => {
    if (movedDistance.current < CLICK_THRESHOLD && !isDragging) {
      setIsExpanded((prev) => !prev);
    }
  };

  return (
    <div
      className="relative mb-3 rounded-lg overflow-hidden select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={isDragging ? handleEnd : undefined}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {openModalConfirm && (
        <ConfirmModal
          isOpen={openModalConfirm}
          onClose={() => setOpenModalConfirm(false)}
          onConfirm={() => handleDeleteNoti?.(noti._id)}
        />
      )}

      {/* BACKGROUND BUTTONS */}
      <div
        className="absolute inset-0 flex justify-end items-center gap-2 pr-3 bg-gray-100 transition-opacity duration-300"
        style={{
          opacity: Math.abs(translateX) / Math.abs(MAX_SWIPE),
        }}
      >
        {!noti.isRead && (
          <button
            title="Mark as Read"
            onClick={() => handleMakeReadNoti?.(noti._id, false)}
            className="cursor-pointer bg-blue-500 text-white text-sm p-2 rounded-md hover:bg-blue-600 transition flex items-center justify-center"
          >
            <i className="mdi mdi-email-open-outline text-lg"></i>
          </button>
        )}
        <button
          title="Delete Notification"
          onClick={() => setOpenModalConfirm(true)}
          className="cursor-pointer bg-red-500 text-white text-sm p-2 rounded-md hover:bg-red-600 transition flex items-center justify-center"
        >
          <i className="mdi mdi-delete-outline text-lg"></i>
        </button>
      </div>

      {/* MAIN ITEM */}
      <div
        className={`group flex flex-col rounded-lg shadow-sm hover:shadow-lg cursor-pointer transition-transform duration-100 ${
          isDragging ? "cursor-grabbing" : ""
        }`}
        style={{
          transform: `translateX(${translateX}px)`,
          backgroundColor: !noti.isRead
            ? applyOpacity(color, 0.12)
            : "#ffffffff",
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={handleClick}
      >
        <div className="flex items-center h-20 px-4">
          <div
            className="w-1 h-full mr-4 rounded-l-lg"
            style={{ backgroundColor: color }}
          ></div>
          <i
            className={`${icon} text-2xl transition-colors duration-300`}
            style={{ color }}
          ></i>
          <div className="flex-1 ml-3">
            <p className="mb-1 font-semibold text-gray-900 group-hover:text-gray-800">
              {noti.title}
            </p>
            <p className="text-sm text-gray-600 line-clamp-1 group-hover:text-gray-700">
              {noti.content}
            </p>
          </div>
          <i
            className={`mdi ${
              isExpanded
                ? "mdi-chevron-up text-gray-500"
                : "mdi-chevron-down text-gray-500"
            } transition-transform duration-300`}
          ></i>
        </div>

        {/* EXPANDABLE CONTENT */}
        <div
          className={`px-6 text-gray-700 text-sm overflow-hidden transition-all duration-300 ease-in-out`}
          style={{
            maxHeight: isExpanded ? "200px" : "0px",
            opacity: isExpanded ? 1 : 0,
          }}
        >
          <p className="pb-3 border-t border-gray-200 mt-2 pt-3">
            {noti.content}
          </p>
        </div>
      </div>
    </div>
  );
}

// =========================
// CONFIG MAP
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
