import type { JobInterface } from "@/pkg/interfaces/job.type";
import type { PagyInput, PagyInterface } from "@/pkg/interfaces/pagy";
import { useEffect, useState } from "react";
import type { JobsQueryInputForm } from "./type";
import type { Option } from "@/pkg/interfaces/option";
import { useErrorHandler } from "@/pkg/helper/errHandler";
import { buildQueryParams } from "@/pkg/helper/query";
import axiosInstance from "@/pkg/axios/axios";
import { JOB_GET_API } from "@/api/job";
import type { AxiosError } from "axios";
import { SHARED_GET } from "@/api/shared";
import type { CategoryInterface } from "@/pkg/interfaces/category";
import { JOB_STATUS } from "@/pkg/enums/job";

const useHook = () => {
  const [jobs, setJobs] = useState<JobInterface[]>();
  const [loading, setLoading] = useState<Boolean>(false);
  const [err, setErr] = useState("");
  const [pagy, setPagy] = useState<PagyInterface>();
  const [queryInput, setQueryInput] = useState<JobsQueryInputForm>({});
  const [page, setPage] = useState(1);
  const [categoriesOptions, setCategoriesOption] = useState<Option[]>();

  const statusOptions = [
    { label: "Available", value: JOB_STATUS.AVAILABLE },
    { label: "Taken", value: JOB_STATUS.TAKEN },
    { label: "In progress", value: JOB_STATUS.IN_PROGRESS },
    { label: "Check complete", value: JOB_STATUS.CHECK_COMPLETE },
    { label: "Completed", value: JOB_STATUS.COMPLETED },
    { label: "Cancelled", value: JOB_STATUS.CANCELLED },
  ];

  const handleError = useErrorHandler();

  const handleGetJobs = async (
    queries: JobsQueryInputForm,
    pagyInput: PagyInput
  ) => {
    setLoading(true);
    try {
      const queryString = buildQueryParams(queries, pagyInput);
      const res = await axiosInstance.get(
        `${JOB_GET_API.JOB_LIST}${queryString}`
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

  const handleGetCategories = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(SHARED_GET.GET_CATEGORIES);
      if (res.data.success) {
        const data: CategoryInterface[] = res.data.data;

        const mappedOptions = data.map((cat) => ({
          label: cat.name,
          value: cat._id,
        }));

        setCategoriesOption(mappedOptions);
      }
    } catch (error) {
      handleError(error as AxiosError, setErr);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetCategories();
  }, []);

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
    categoriesOptions,
    statusOptions,
  };
};

export default useHook;
