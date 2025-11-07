import { JOB_GET_API, JOB_POST_API, JOB_PUT_API } from "@/api/job";
import axiosInstance from "@/pkg/axios/axios";
import { JOB_STATUS } from "@/pkg/enums/job";
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

  const handleCompleteTask = async (taskId: string, jobId: string) => {
    setLoading(true);
    try {
      const res = await axiosInstance.put(
        `${JOB_PUT_API.UPDATE_TASK_STATUS}/${taskId}`
      );
      if (res.data.success) {
        toast.success("Updated successfully!");
        handleFetchJobId(jobId);
      }
    } catch (error) {
      handleError(error as AxiosError, setErr);
    } finally {
      setLoading(false);
    }
  };

  const handleStartJob = async (jobId: string) => {
    setLoading(true);
    try {
      const body = {
        status: JOB_STATUS.IN_PROGRESS,
      };
      const res = await axiosInstance.put(
        `${JOB_PUT_API.UPDATE_JOB_STATUS}/${jobId}`,
        body
      );
      if (res.data.success) {
        toast.success("Started successfully!");
        handleFetchJobId(jobId);
      }
    } catch (error) {
      handleError(error as AxiosError, setErr);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelJob = async (jobId: string) => {
    setLoading(true);
    try {
      const body = {
        status: JOB_STATUS.CANCELLED,
      };
      const res = await axiosInstance.put(
        `${JOB_PUT_API.UPDATE_JOB_STATUS}/${jobId}`,
        body
      );
      if (res.data.success) {
        toast.success("Canceled successfully!");
        handleFetchJobId(jobId);
      }
    } catch (error) {
      handleError(error as AxiosError, setErr);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestCheckComplete = async (jobId: string) => {
    setLoading(true);
    try {
      const body = {
        status: JOB_STATUS.CHECK_COMPLETE,
      };
      const res = await axiosInstance.put(
        `${JOB_PUT_API.UPDATE_JOB_STATUS}/${jobId}`,
        body
      );
      if (res.data.success) {
        toast.success("Request check complete successfully!");
        handleFetchJobId(jobId);
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
    handleCompleteTask,
    handleStartJob,
    handleCancelJob,
    handleRequestCheckComplete,
  };
};

export default useHook;
