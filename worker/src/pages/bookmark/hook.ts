import { SHARED_GET } from "@/api/shared";
import axiosInstance from "@/pkg/axios/axios";
import { useErrorHandler } from "@/pkg/helper/errHandler";
import type { CategoryInterface } from "@/pkg/interfaces/category";
import type { Option } from "@/pkg/interfaces/option";
import type { AxiosError } from "axios";
import { useEffect, useState } from "react";
import type { JobBookmarkQueryFormInput } from "./type";
import type { PagyInput, PagyInterface } from "@/pkg/interfaces/pagy";
import { JOB_DELETE_API, JOB_GET_API } from "@/api/job";
import { buildQueryParams, parseQueryArrayToString } from "@/pkg/helper/query";
import type { JobInterface } from "@/pkg/interfaces/job.type";
import { toast } from "react-toastify";

const useHook = () => {
  const [categoriesOptions, setCategoriesOption] = useState<Option[]>();
  const [loading, setLoading] = useState<Boolean>(false);
  const handleError = useErrorHandler();
  const [err, setErr] = useState("");
  const [pagy, setPagy] = useState<PagyInterface>();
  const [page, setPage] = useState(1);
  const [jobs, setJobs] = useState<JobInterface[]>();

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

  const handleGetBookmarkedList = async (
    query?: JobBookmarkQueryFormInput,
    pagyInput?: PagyInput
  ) => {
    setLoading(true);
    try {
      const categoriesParsed = parseQueryArrayToString(query?.categories || []);
      const queryInput = {
        title: query?.title || "",
        minBudget: query?.minBudget || "",
        maxBudget: query?.maxBudget || "",
        categories: categoriesParsed,
      };

      const queryStr = buildQueryParams(
        queryInput,
        pagyInput || ({ page: 1, limit: 10 } as PagyInput)
      );
      const res = await axiosInstance.get(
        `${JOB_GET_API.JOB_BOOKMARK_LIST}${queryStr}`
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

  const handleRemoveBookmarked = async (jobId: string) => {
    setLoading(true);
    try {
      const res = await axiosInstance.delete(
        `${JOB_DELETE_API.REMOVE_BOOKMARKED}/${jobId}`
      );

      if (res.data.success) {
        toast.success("Removed job from bookmark");
        handleGetBookmarkedList();
      }
    } catch (error) {
      handleError(error as AxiosError, setErr);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!categoriesOptions) {
      handleGetCategories();
    }
    handleGetBookmarkedList();
  }, [page]);

  return {
    categoriesOptions,
    loading,
    err,
    handleGetBookmarkedList,
    pagy,
    setPage,
    jobs,
    page,
    handleRemoveBookmarked,
  };
};

export default useHook;
