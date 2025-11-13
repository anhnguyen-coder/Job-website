import { NOTI_DEL, NOTI_GET, NOTI_POST } from "@/api/noti";
import axiosInstance from "@/pkg/axios/axios";
import { useErrorHandler } from "@/pkg/helper/errHandler";
import { buildQueryParams } from "@/pkg/helper/query";
import type { NotificationInterface } from "@/pkg/interfaces/notification";
import type { PagyInterface } from "@/pkg/interfaces/pagy";
import type { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

const useNotiHooks = () => {
  const [getListLoading, setGetListLoading] = useState<boolean>(false);
  const [pagy, setPagy] = useState<PagyInterface>();
  const [page, setPage] = useState(1);
  const [notifications, setNotifications] = useState<NotificationInterface[]>(
    []
  );
  const [err, setError] = useState("");
  const handleError = useErrorHandler();
  const [markReadLoading, setMarkReadLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const handleGetNotiList = async (page = 1, isLoadMore?: boolean, limit?: number) => {
    setGetListLoading(true);
    try {
      const pagyInput = {
        page: page,
        limit: limit ?? 15,
      };

      const queryStr = buildQueryParams({}, pagyInput);
      const res = await axiosInstance.get(`${NOTI_GET.LIST}${queryStr}`);
      if (res.data.success) {
        if (isLoadMore) {
          setNotifications((prev) => [...(prev || []), ...res.data.data]);
        } else {
          setNotifications(res.data.data);
        }
        setPagy(res.data.pagy);
      }
    } catch (error) {
      handleError(error as AxiosError, setError);
    } finally {
      setGetListLoading(false);
    }
  };

  const handleMakeReadNoti = async (
    notiId?: string,
    isMarkReadAll?: boolean
  ) => {
    setMarkReadLoading(true);
    try {
      const body = { notiId, isMarkReadAll };
      const res = await axiosInstance.post(NOTI_POST.MAKE_READ, body);

      if (res.data.success) {
        toast.success("Marked notification as read.");

        if (isMarkReadAll) {
          await handleGetNotiList();
        } else {
          if (!notiId) return;
          setNotifications((prev) =>
            prev.map((noti) =>
              noti._id === notiId ? { ...noti, isRead: true } : noti
            )
          );
        }
      }
    } catch (error) {
      handleError(error as AxiosError, setError);
    } finally {
      setMarkReadLoading(false);
    }
  };

  const handleDeleteNoti = async (notiId: string) => {
    setDeleteLoading(true);
    try {
      const res = await axiosInstance.delete(`${NOTI_DEL.DELETE}/${notiId}`);
      if (res.data.success) {
        setNotifications((prev) => prev.filter((noti) => noti._id !== notiId));
        toast.success("Deleted notification successfully.");
      }
    } catch (error) {
      handleError(error as AxiosError, setError);
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    getListLoading,
    pagy,
    notifications,
    err,
    markReadLoading,
    deleteLoading,
    page,
    setPage,
    handleGetNotiList,
    handleMakeReadNoti,
    handleDeleteNoti,
  };
};

export default useNotiHooks;
