import { JOB_GET_API, JOB_POST_API, JOB_PUT_API } from "@/api/job";
import axiosInstance from "@/pkg/axios/axios";
import { JOB_STATUS } from "@/pkg/enums/job";
import { useErrorHandler } from "@/pkg/helper/errHandler";
import type { JobInterface } from "@/pkg/interfaces/job.type";
import type { AxiosError } from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import type { RatingInput } from "../type";
import { RATING_GET_API, RATING_POST_API } from "@/api/rating";
import type { RatingInterface } from "@/pkg/interfaces/rating";
import type { PagyInterface } from "@/pkg/interfaces/pagy";
import { buildQueryParams } from "@/pkg/helper/query";

const useHook = () => {
  const [job, setJob] = useState<JobInterface>();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const handleError = useErrorHandler();
  const [ratings, setRatings] = useState<RatingInterface[]>([]);
  const [ratingPagy, setRatingPagy] = useState<PagyInterface>();
  const [ratingPage, setRatingPage] = useState(1);
  const didFetchCustomerRating = useRef(false);

  const handleFetchJobId = useCallback(
    async (jobId: string) => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(
          `${JOB_GET_API.JOB_DETAIL}/${jobId}`
        );
        if (res.data.success) setJob(res.data.data);
      } catch (error) {
        handleError(error as AxiosError, setErr);
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

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

  const viewCustomerRating = useCallback(async () => {
    setLoading(true);
    try {
      if (!job) return;
      const query = { customerId: job.customerId._id };
      const pagyInput = { page: ratingPage, limit: 5 };
      const queryString = buildQueryParams(query, pagyInput);
      const res = await axiosInstance.get(
        `${RATING_GET_API.CUSTOMER_RATINGS}/${queryString}`
      );
      if (res.data.success) {
        setRatings(res.data.data);
        setRatingPagy(res.data.pagy);
      }
    } catch (error) {
      handleError(error as AxiosError, setErr);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const handleMakeRateCustomer = useCallback(
    async (input: RatingInput) => {
      setLoading(true);
      try {
        const res = await axiosInstance.post(
          RATING_POST_API.RATE_CUSTOMER,
          input
        );
        if (res.data.success) {
          toast.success("Feedback sent successfully!");
          viewCustomerRating();
        }
      } catch (error) {
        handleError(error as AxiosError, setErr);
      } finally {
        setLoading(false);
      }
    },
    [handleError, viewCustomerRating]
  );

  useEffect(() => {
    if (!job) return;
    if (didFetchCustomerRating.current) return;
    didFetchCustomerRating.current = true;
    viewCustomerRating();
  }, [ratingPage, job]);

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
    handleMakeRateCustomer,
    viewCustomerRating,
    ratings,
    ratingPagy,
    ratingPage,
    setRatingPage,
  };
};

export default useHook;
