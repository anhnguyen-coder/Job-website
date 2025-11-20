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
import { MESSAGE_GET_API, MESSAGE_POST_API } from "@/api/message";
import type {
  ConversationInterface,
  MessageInterface,
} from "@/pkg/interfaces/conversation";

const useHook = () => {
  const [job, setJob] = useState<JobInterface>();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const handleError = useErrorHandler();
  const [ratings, setRatings] = useState<RatingInterface[]>([]);
  const [ratingPagy, setRatingPagy] = useState<PagyInterface>();
  const [ratingPage, setRatingPage] = useState(1);
  const didFetchCustomerRating = useRef(false);
  const controllerRef = useRef<AbortController | null>(null);

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

  const handleGetConversation = useCallback(
    async (userId: string): Promise<ConversationInterface> => {
      try {
        const res = await axiosInstance.get(
          `${MESSAGE_GET_API.CONVERSATION}?userId=${userId}`
        );
        return res.data.success ? res.data.data : ({} as ConversationInterface);
      } catch (error) {
        handleError(error as AxiosError, setErr);
        return {} as ConversationInterface;
      }
    },
    []
  );

  const handleGetConversationMessage = useCallback(
    async (
      conversationId: string,
      page = 1
    ): Promise<[MessageInterface[], PagyInterface]> => {
      try {
        controllerRef.current?.abort();
        controllerRef.current = new AbortController();

        const query = { conversationId };
        const pagyInput = { page: page, limit: 20 };
        const queryStr = buildQueryParams(query, pagyInput);

        const res = await axiosInstance.get(
          `${MESSAGE_GET_API.MESSAGES}${queryStr}`,
          {
            signal: controllerRef.current.signal,
          }
        );

        if (res.data.success) {
          const messages: MessageInterface[] = res.data.data ?? [];
          const pagy: PagyInterface = res.data.pagy ?? {};
          return [messages, pagy];
        }
        return [[], {}];
      } catch (error) {
        if ((error as any).name !== "CanceledError") {
          handleError(error as AxiosError, setErr);
        }

        return [[], {}];
      }
    },
    []
  );

  const handleSendMessage = useCallback(
    async (
      conversationId: string,
      message: string,
      userId: string,
      files?: File[]
    ): Promise<MessageInterface> => {
      try {
        const formData = new FormData();
        formData.append("conversationId", conversationId);
        formData.append("message", message);
        formData.append("userId", userId);

        if (files?.length) {
          files.forEach((file) => {
            if (file instanceof File) {
              formData.append("files", file);
            } else {
              console.warn("Invalid file skipped:", file);
            }
          });
        }

        const res = await axiosInstance.post(MESSAGE_POST_API.SEND, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.data.success) {
          return res.data.data as MessageInterface;
        }

        return {} as MessageInterface;
      } catch (error) {
        handleError(error as AxiosError, setErr);
        return {} as MessageInterface;
      }
    },
    []
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
    handleGetConversation,
    handleGetConversationMessage,
    handleSendMessage,
  };
};

export default useHook;
