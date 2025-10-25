import type { JobInterface } from "@/pkg/types/interfaces/job.type";
import { useState } from "react";
import type { JobsQueryInputForm } from "./type";
import { errhandler } from "@/pkg/helpers/errorHandler";
import type { AxiosError } from "axios";
import axiosInstance from "@/pkg/axios/axiosInstance";
import { GET } from "@/apis/customer/job";
import type { PagyInput, PagyInterface } from "@/pkg/types/interfaces/pagy";
import { buildQueryParams } from "@/pkg/helpers/query";

const useHook = () => {
  const [jobs, setJobs] = useState<JobInterface[]>();
  const [loading, setLoading] = useState<Boolean>(false);
  const [err, setErr] = useState("");
  const [pagy, setPagy] = useState<PagyInterface>();
  const [queryInput, setQueryInput] = useState<JobsQueryInputForm>({});
  const [page, setPage] = useState(1);

  const handleGetJobs = async (
    queries: JobsQueryInputForm,
    pagyInput: PagyInput
  ) => {
    setLoading(true);
    try {
      const queryString = buildQueryParams(queries, pagyInput);
      const res = await axiosInstance.get(`${GET.GET_JOBS}${queryString}`);
      if (res.data.success) {
        setJobs(res.data.data);
        setPagy(res.data.pagy);
      }
    } catch (error) {
      errhandler(error as AxiosError, setErr);
    } finally {
      setLoading(false);
    }
  };

  return {
    jobs,
    loading,
    err,
    pagy,
    queryInput,
    page,
    setQueryInput,
    handleGetJobs,
    setPage,
  };
};

export default useHook;
