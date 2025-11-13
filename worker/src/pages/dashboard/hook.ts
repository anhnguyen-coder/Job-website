import { GET } from "@/api/dashboard";
import { JOB_GET_API } from "@/api/job";
import axiosInstance from "@/pkg/axios/axios";
import { useErrorHandler } from "@/pkg/helper/errHandler";
import { buildQueryParams } from "@/pkg/helper/query";
import type { JobRequestInterface } from "@/pkg/interfaces/job.type";
import type { PagyInterface } from "@/pkg/interfaces/pagy";
import type { PaymentInterface } from "@/pkg/interfaces/payment";
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
  const [jobs, setJobs] = useState<JobRequestInterface[]>();
  const handleError = useErrorHandler();
  const [paymentLoad, setPaymentLoad] = useState(false);
  const [payments, setPayments] = useState<PaymentInterface[]>();
  const [paymentPage, setPaymentPage] = useState(1);
  const [paymentPagy, setPaymentPagy] = useState<PagyInterface>();

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
    setLoading(true);
    try {
      const queryStr = buildQueryParams({}, { page: 1, limit: 5 });
      const res = await axiosInstance.get(
        `${JOB_GET_API.JOB_CURRENT_LIST}${queryStr}`
      );
      if (res.data.success) {
        setJobs(res.data.data);
      }
    } catch (error) {
      handleError(error as AxiosError, setErr);
    } finally {
      setLoading(false);
    }
  };

  const handleGetPaymentHistory = async (page = 1) => {
    setPaymentLoad(true);
    try {
      const pagyInput = {
        page: page,
        limit: 10,
      };
      const queryStr = buildQueryParams({}, pagyInput);
      const res = await axiosInstance.get(`${GET.PAYMENT_HISTORY}${queryStr}`);
      if (res.data.data) {
        setPayments(res.data.data);
        setPaymentPagy(res.data.pagy);
      }
    } catch (error) {
      handleError(error as AxiosError, setErr);
    } finally {
      setPaymentLoad(false);
    }
  };

  return {
    stats,
    err,
    loading,
    jobs,
    handleGetStats,
    handleGetJobList,

    // payment
    paymentLoad,
    payments,
    paymentPage,
    setPaymentPage,
    paymentPagy,
    handleGetPaymentHistory,
  };
};

export default useHook;
