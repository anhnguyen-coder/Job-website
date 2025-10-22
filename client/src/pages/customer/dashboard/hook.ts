import { GET } from "@/apis/customer/dashboard/apis";
import axiosInstance from "@/pkg/axios/axiosInstance";
import { errhandler } from "@/pkg/helpers/errorHandler";
import type { AxiosError } from "axios";
import { useState } from "react";

export interface stat {
    id: number,
    label: string,
    value: string,
}

const useHook = () => {
  const [stats, setStats] = useState<stat[]>();
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGetStats = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(GET.GET_DASHBOARD_STATS);

      if (res.data.success) {
        setStats(res.data.data);
        // console.log(res.data.data)
      }
    } catch (error) {
      errhandler(error as AxiosError, setErr);
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    err,
    loading,
    handleGetStats,
  };
};

export default useHook;
