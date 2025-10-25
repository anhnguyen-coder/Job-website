import { GET } from "@/apis/customer/job";
import axiosInstance from "@/pkg/axios/axiosInstance";
import { errhandler } from "@/pkg/helpers/errorHandler";
import type { JobInterface } from "@/pkg/types/interfaces/job.type";
import type { AxiosError } from "axios";
import { useState } from "react";

const useHook = () => {
  const [job, setJob] = useState<JobInterface>();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleFetchJobId = async (jobId: string) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`${GET.GET_JOB_ID}/${jobId}`);
        console.log(res.data)
      if (res.data.success) {
        setJob(res.data.data);
    
      }
    } catch (error) {
      errhandler(error as AxiosError, setErr);
    } finally {
      setLoading(false);
    }
  };

  return {
    job,
    loading,
    err,
    handleFetchJobId,
  };
};

export default useHook;
