import { useEffect, useRef } from "react";
import useNotiHooks from "@/hooks/useNoti";
import { LoadingCustom } from "./loading";
import { NotiItem } from "./notiItem";
import type { NotificationInterface } from "@/pkg/interfaces/notification";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function NotiSidebar({ open, onClose }: Props) {
  const {
    getListLoading,
    notifications,
    handleGetNotiList,
    page,
    handleMakeReadNoti,
    handleDeleteNoti,
    pagy,
    setPage,
  } = useNotiHooks();

  const scrollRef = useRef<HTMLDivElement>(null);
  const isLoadingMore = useRef(false);

  useEffect(() => {
    handleGetNotiList(page, isLoadingMore.current);
  }, [page]);

  // ESC để đóng
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const calculateTotalUnRead = (notifies: NotificationInterface[]) => {
    if (!notifies) return 0;
    let total = 0;
    notifies.forEach((noti) => {
      if (!noti.isRead) {
        total = total + 1;
      }
    });

    return total;
  };

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container || isLoadingMore.current || !pagy) return;

    if (
      container.scrollHeight - container.scrollTop <=
      container.clientHeight + 20
    ) {
      if (page < (pagy.totalPages || 1)) {
        isLoadingMore.current = true;
        if (pagy && pagy.nextPage) {
          setPage((prev) => prev + 1);
        }
        isLoadingMore.current = false;
      }
    }
  };

  return (
    <>
      {/* Overlay nền mờ */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-500 ease-in-out ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-150 bg-white shadow-2xl z-50 transform transition-all duration-500 ease-in-out
        ${open ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-5 p-4 border-b border-gray-200">
          <div className="flex items-center justify-between flex-1">
            <div className="flex flex-col items-start">
              <h2 className="text-lg font-semibold text-gray-800">
                Notifications
              </h2>
              <p className="flex items-center m-0 gap-1">
                <span>
                  <i className="mdi mdi-email-outline"></i>
                </span>
                Unread:
                <span>{calculateTotalUnRead(notifications)} notifications</span>
              </p>
            </div>

            <button
              title="Mark all as Read"
              onClick={() => handleMakeReadNoti("", true)}
              className="cursor-pointer bg-blue-500 text-white text-sm px-3 py-1 rounded-md hover:bg-blue-600 transition flex items-center justify-center"
            >
              <i className="mdi mdi-email-open-outline text-lg"></i>
            </button>
          </div>

          <button
            className="text-gray-500 hover:text-gray-700 transition-colors hover:bg-red-500 hover:text-white hover:font-bold cursor-pointer px-3 py-1 rounded-lg"
            onClick={onClose}
          >
            <i className="mdi mdi-close text-xl"></i>
          </button>
        </div>

        {getListLoading ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <LoadingCustom />
          </div>
        ) : (
          <>
            {/* Danh sách thông báo */}
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="p-4 overflow-y-auto h-[calc(100%-4rem)] custom-scroll"
            >
              {notifications.length > 0 ? (
                notifications.map((noti) => (
                  <NotiItem
                    key={noti._id}
                    noti={noti}
                    handleDeleteNoti={handleDeleteNoti}
                    handleMakeReadNoti={handleMakeReadNoti}
                  />
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center mt-10">
                  No notifications
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
