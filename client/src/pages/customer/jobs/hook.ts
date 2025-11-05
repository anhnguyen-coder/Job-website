import type { JobInterface } from "@/pkg/types/interfaces/job.type";
import { useEffect, useState } from "react";
import type { JobsQueryInputForm } from "./type";
import type { AxiosError } from "axios";
import axiosInstance from "@/pkg/axios/axiosInstance";
import { GET } from "@/apis/customer/job";
import { GET as GET_SHARED } from "@/apis/shared/category";
import type { PagyInput, PagyInterface } from "@/pkg/types/interfaces/pagy";
import { buildQueryParams } from "@/pkg/helpers/query";
import { useErrorHandler } from "@/pkg/helpers/errorHandler";
import type { Option } from "@/pkg/types/interfaces/option";
import type { CategoryInterface } from "@/pkg/types/interfaces/category";

const useHook = () => {
  const [jobs, setJobs] = useState<JobInterface[]>();
  const [loading, setLoading] = useState<Boolean>(false);
  const [err, setErr] = useState("");
  const [pagy, setPagy] = useState<PagyInterface>();
  const [queryInput, setQueryInput] = useState<JobsQueryInputForm>({});
  const [page, setPage] = useState(1);
  const [categoriesOptions, setCategoriesOption] = useState<Option[]>();

  const handleError = useErrorHandler();

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
      handleError(error as AxiosError, setErr);
    } finally {
      setLoading(false);
    }
  };

  const handleGetCategories = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(GET_SHARED.GET_CATEGORIES);
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
  };
};

export default useHook;
