import { DELETE, GET, PUT } from "@/apis/customer/job";
import { GET as GET_SHARED } from "@/apis/shared/category";
import axiosInstance from "@/pkg/axios/axiosInstance";
import type { JobInterface } from "@/pkg/types/interfaces/job.type";
import type { AxiosError } from "axios";
import { useState } from "react";
import { useErrorHandler } from "@/pkg/helpers/errorHandler";
import type { Option } from "@/pkg/types/interfaces/option";
import type { CategoryInterface } from "@/pkg/types/interfaces/category";
import type { JobCreateForm, TaskInputForm } from "../create/type";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const useHook = () => {
  const [job, setJob] = useState<JobInterface>();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [categoriesOptions, setCategoriesOption] = useState<Option[]>();
  const [task, setTask] = useState<TaskInputForm>({
    title: "",
    description: "",
  });
  const [index, setIndex] = useState(-1);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [disable, setDisable] = useState(true);
  const [inputFormUpdate, setInputUpdate] = useState<JobCreateForm>({
    title: "",
    description: "",
    categoryIds: [],
    location: "",
    budget: 0,
    tasks: [],
  });

  const navigate = useNavigate();

  const handleError = useErrorHandler();

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

  const handleFetchJobId = async (jobId: string) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`${GET.GET_JOB_ID}/${jobId}`);
      if (res.data.success) {
        setJob(res.data.data);
      }
    } catch (error) {
      handleError(error as AxiosError, setErr);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateJob = async (id: string, form: JobCreateForm) => {
    setLoading(true);
    try {
      const res = await axiosInstance.put(`${PUT.UPDATE_JOB}/${id}`, form);
      if (res.data.success) {
        toast.success("Success!");
        handleFetchJobId(id);
      }
    } catch (error) {
      handleError(error as AxiosError, setErr);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeCategory = (values: string[]) => {
    setInputUpdate((prev) => ({
      ...prev,
      categoryIds: values,
    }));
  };

  const handleAddTask = (task: TaskInputForm, index?: number) => {
    if (index !== undefined && index !== null && index != -1) {
      const input = inputFormUpdate.tasks[index];

      if (input) {
        input.title = task.title;
        input.description = task.description;

        inputFormUpdate.tasks[index] = input;
        setInputUpdate(inputFormUpdate);
      }

      setTask({ title: "", description: "" });
      setIndex(-1);
      return;
    }

    if (!task) return;
    setInputUpdate((prev) => ({
      ...prev,
      tasks: [...(prev.tasks || []), task],
    }));
    setTask({ title: "", description: "" });
  };

  const handleOpenTask = (task: TaskInputForm, index: number) => {
    setTask(task);
    setIndex(index);

    setOpenTaskModal(true);
  };

  const makeJobComplete = async (jobId: string, paymentMethod: string) => {
    setLoading(true);
    try {
      const body = {
        workerId: job?.assignedWorkerId?._id,
        paymentMethod: paymentMethod,
      };
      const res = await axiosInstance.put(
        `${PUT.MAKE_COMPLETE}/${job?._id}`,
        body
      );

      if (res.data.success) {
        toast.success("Mark completed successfully!");
        handleFetchJobId(jobId);
      }
    } catch (error) {
      handleError(error as AxiosError, setErr);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.delete(`${DELETE.JOB}/${job?._id}`);
      if (res.data.success) {
        toast.success("Deleted job successfully!");
        navigate("/jobs");
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
    handleGetCategories,
    categoriesOptions,
    handleUpdateJob,
    task,
    setTask,
    index,
    setIndex,
    openTaskModal,
    setOpenTaskModal,
    disable,
    setDisable,
    inputFormUpdate,
    setInputUpdate,
    handleChangeCategory,
    handleAddTask,
    handleOpenTask,
    makeJobComplete,
    handleDeleteJob,
  };
};

export default useHook;
