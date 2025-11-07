import { JOB_GET_API, JOB_POST_API } from "@/api/job";
import axiosInstance from "@/pkg/axios/axios";
import { useErrorHandler } from "@/pkg/helper/errHandler";
import type { JobInterface } from "@/pkg/interfaces/job.type";
import type { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

const useHook = () => {
  const [job, setJob] = useState<JobInterface>();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const handleError = useErrorHandler();

  const handleFetchJobId = async (jobId: string) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`${JOB_GET_API.JOB_DETAIL}/${jobId}`);
      if (res.data.success) {
        setJob(res.data.data);
      }
    } catch (error) {
      handleError(error as AxiosError, setErr);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyJob = async (jobId: string) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post(
        `${JOB_POST_API.MAKE_REQUEST_JOB}/${jobId}`
      );
      if (res.data.success) {
        toast.success("Applied job successfully, wating for customer approve!");
      }
    } catch (error) {
      handleError(error as AxiosError, setErr);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmarkJob = async (jobId: string) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post(
        `${JOB_POST_API.MAKE_BOOKMARK_JOB}/${jobId}`
      );
      if (res.data.success) {
        toast.success("Saved to wishlist successfully!");
      }
    } catch (error) {
      handleError(error as AxiosError, setErr);
    } finally {
      setLoading(false);
    }
  };

  return {
    job,
    loading,
    err,
    handleFetchJobId,
    handleApplyJob,
    handleBookmarkJob,
  };
};

export default useHook;
