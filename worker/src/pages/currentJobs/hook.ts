import { JOB_GET_API } from "@/api/job";
import axiosInstance from "@/pkg/axios/axios";
import { useErrorHandler } from "@/pkg/helper/errHandler";
import { buildQueryParams } from "@/pkg/helper/query";
import type { JobRequestInterface } from "@/pkg/interfaces/job.type";
import type { PagyInput, PagyInterface } from "@/pkg/interfaces/pagy";
import type { AxiosError } from "axios";
import { useEffect, useState } from "react";
import type { CurrentListJobQueryInput } from "./type";
import { JOB_REQUEST_STATUS } from "@/pkg/enums/job";
import type { Option } from "@/pkg/interfaces/option";

const useHook = () => {
  const [loading, setLoading] = useState<Boolean>(false);
  const handleError = useErrorHandler();
  const [err, setErr] = useState("");
  const [pagy, setPagy] = useState<PagyInterface>();
  const [page, setPage] = useState(1);
  const [jobs, setJobs] = useState<JobRequestInterface[]>();

  const statusRequestOptions: Option[] = [
    { value: JOB_REQUEST_STATUS.ACCEPTED, label: "Accepted" },
    { value: JOB_REQUEST_STATUS.PENDING, label: "Pending" },
    { value: JOB_REQUEST_STATUS.REJECTED, label: "Rejected" },
  ];

  const handleGetMyCurrentListJobs = async (
    query?: CurrentListJobQueryInput,
    pagyInput?: PagyInput
  ) => {
    setLoading(true);
    try {
      const queryStr = buildQueryParams(
        query ?? {},
        pagyInput || { page: 1, limit: 10 }
      );
      const res = await axiosInstance.get(
        `${JOB_GET_API.JOB_CURRENT_LIST}${queryStr}`
      );
      if (res.data.success) {
        setJobs(res.data.data);
        setPagy(res.data.pagy);
      }
    } catch (error) {
      handleError(error as AxiosError, setErr);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetMyCurrentListJobs();
  }, [page]);

  return {
    jobs,
    loading,
    err,
    page,
    pagy,
    statusRequestOptions,
    setPage,
    handleGetMyCurrentListJobs,
  };
};

export default useHook;
