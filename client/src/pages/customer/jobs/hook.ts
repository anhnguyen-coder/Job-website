import type { JobInterface } from "@/pkg/types/interfaces/job.type";
import { useState } from "react";
import type { JobsQueryInputForm } from "./type";
import { errhandler } from "@/pkg/helpers/errorHandler";
import type { AxiosError } from "axios";
import axiosInstance from "@/pkg/axios/axiosInstance";
import { GET } from "@/apis/customer/job";
import { GET as GET_CATEGORY } from "@/apis/shared/category";
import type { PagyInput, PagyInterface } from "@/pkg/types/interfaces/pagy";
import { buildQueryParams } from "@/pkg/helpers/query";
import type { Option } from "@/pkg/types/interfaces/option";
import type { CategoryInterface } from "@/pkg/types/interfaces/category";

const useHook = () => {
  const [jobs, setJobs] = useState<JobInterface[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState("");
  const [pagy, setPagy] = useState<PagyInterface>();
  const [queryInput, setQueryInput] = useState<JobsQueryInputForm>({});
  const [page, setPage] = useState(1);
  const [categoriesOptions, setCategoriesOption] = useState<Option[]>();

  const handleGetJobs = async (
    queries: JobsQueryInputForm,
    pagyInput: PagyInput
  ) => {
    setLoading(true);
    try {
      console.log(queries);
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

  const handleGetCategories = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(GET_CATEGORY.GET_CATEGORIES);
      if (res.data.success) {
        const data: CategoryInterface[] = res.data.data;

        const mappedOptions = data.map((cat) => ({
          label: cat.name,
          value: cat._id,
        }));

        setCategoriesOption(mappedOptions);
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
    categoriesOptions,
    setQueryInput,
    handleGetJobs,
    setPage,
    handleGetCategories,
  };
};

export default useHook;
