import { GET, PUT } from "@/apis/customer/job";
import axiosInstance from "@/pkg/axios/axiosInstance";
import { useErrorHandler } from "@/pkg/helpers/errorHandler";
import { buildQueryParams } from "@/pkg/helpers/query";
import type { JobRequestInterface } from "@/pkg/types/interfaces/job.type";
import type { PagyInterface } from "@/pkg/types/interfaces/pagy";
import type { AxiosError } from "axios";
import { useEffect, useState } from "react";
import type { JobRequestQueryInput } from "../type";
import type { FilterOption } from "@/pkg/types/interfaces/filterField";
import { JOB_REQUEST_STATUS } from "@/pkg/types/enums/job";
import { toast } from "react-toastify";

const useHook = () => {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [pagy, setPagy] = useState<PagyInterface>();
  const [page, setPage] = useState(1);
  const [jobRequests, setJobRequests] = useState<JobRequestInterface[]>();

  const handleError = useErrorHandler();

  const statusOptions: FilterOption[] = [
    {
      label: "Pending",
      value: JOB_REQUEST_STATUS.PENDING,
    },
    {
      label: "Accepted",
      value: JOB_REQUEST_STATUS.ACCEPTED,
    },
    {
      label: "Rejected",
      value: JOB_REQUEST_STATUS.REJECTED,
    },
  ];

  const handleGetJobRequestList = async (query?: JobRequestQueryInput) => {
    setLoading(true);
    try {
      const pagyInput = {
        page: page,
        limit: 10,
      };

      const queryStr = buildQueryParams(query ?? {}, pagyInput);
      const res = await axiosInstance.get(`${GET.JOB_REQUEST}${queryStr}`);

      if (res.data.success) {
        setJobRequests(res.data.data);
        setPagy(res.data.pagy);
      }
    } catch (error) {
      handleError(error as AxiosError, setErr);
    } finally {
      setLoading(false);
    }
  };

  const makeJobApproval = async (
    id: string,
    status: string,
    workerId: string
  ) => {
    setLoading(true);
    try {
      const body = {
        workerId: workerId,
        status: status,
      };
      const res = await axiosInstance.put(`${PUT.JOB_APPROVAL}/${id}`, body);
      if (res.data.success) {
        if (status === JOB_REQUEST_STATUS.ACCEPTED) {
          toast.success("Job approved successfully!");
        } else if (status === JOB_REQUEST_STATUS.REJECTED) {
          toast.success("Job rejected successfully!");
        }

        handleGetJobRequestList();
      }
    } catch (error) {
      handleError(error as AxiosError, setErr);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetJobRequestList();
  }, [page]);

  return {
    loading,
    jobRequests,
    pagy,
    page,
    setPage,
    err,
    handleGetJobRequestList,
    statusOptions,
    makeJobApproval,
  };
};

export default useHook;
