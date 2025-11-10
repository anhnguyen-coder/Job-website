import { GET } from "@/apis/customer/dashboard";
import { GET as GET_JOB } from "@/apis/customer/job";
import axiosInstance from "@/pkg/axios/axiosInstance";
import { useErrorHandler } from "@/pkg/helpers/errorHandler";
import { parseQueryArrayToString } from "@/pkg/helpers/query";
import { JOB_STATUS } from "@/pkg/types/enums/job";
import type { JobInterface } from "@/pkg/types/interfaces/job.type";
import type { AxiosError } from "axios";
import { useState } from "react";

export interface stat {
  id: number;
  label: string;
  value: string;
}

const useHook = () => {
  const [stats, setStats] = useState<stat[]>();
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<JobInterface[]>();
  const handleError = useErrorHandler();

  const handleGetStats = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(GET.GET_DASHBOARD_STATS);

      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (error) {
      handleError(error as AxiosError, setErr);
    } finally {
      setLoading(false);
    }
  };

  const handleGetJobList = async () => {
    try {
      const status = [
        JOB_STATUS.IN_PROGRESS,
        JOB_STATUS.TAKEN,
        JOB_STATUS.CHECK_COMPLETE,
        JOB_STATUS.COMPLETED,
      ];

      const statusParse = parseQueryArrayToString(status);

      const res = await axiosInstance.get(
        `${GET_JOB.GET_JOBS}?limit=5&status=${statusParse}`
      );
      if (res.data.success) {
        setJobs(res.data.data);
      }
    } catch (error) {
      handleError(error as AxiosError, setErr);
    }
  };

  return {
    stats,
    err,
    loading,
    jobs,
    handleGetStats,
    handleGetJobList,
  };
};

export default useHook;
