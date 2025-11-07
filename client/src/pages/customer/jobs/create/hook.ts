import { GET } from "@/apis/shared/category";
import axiosInstance from "@/pkg/axios/axiosInstance";
import type { CategoryInterface } from "@/pkg/types/interfaces/category";
import type { AxiosError } from "axios";
import { useState } from "react";
import type { JobCreateForm } from "./type";
import { POST } from "@/apis/customer/job";
import type { Option } from "@/pkg/types/interfaces/option";
import { useErrorHandler } from "@/pkg/helpers/errorHandler";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const useHook = () => {
  const [categories, setCategories] = useState<CategoryInterface[]>();
  const [loading, setLoading] = useState<Boolean>(false);
  const [err, setErr] = useState("");
  const [formInput, setFormInput] = useState<JobCreateForm>({
    title: "",
    description: "",
    categoryIds: [],
    location: "",
    budget: 0,
    tasks: [],
  });
  const [categoriesOptions, setCategoriesOption] = useState<Option[]>();

  const handleError = useErrorHandler();
  const navigate = useNavigate()

  const handleGetCategories = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(GET.GET_CATEGORIES);
      if (res.data.success) {
        const data: CategoryInterface[] = res.data.data;

        setCategories(data);

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

  const handleCreateJob = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.post(POST.CREATE_JOB, formInput);
      if (res.data.success) {
        toast.success("Created job successfully!");
        navigate("/jobs")
      }
    } catch (error) {
      handleError(error as AxiosError, setErr);
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    loading,
    formInput,
    categoriesOptions,
    err,
    setFormInput,
    handleGetCategories,
    handleCreateJob,
  };
};

export default useHook;
