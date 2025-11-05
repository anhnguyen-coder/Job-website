import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import { toast } from "react-toastify";

export const useErrorHandler = () => {
  const navigate = useNavigate();

  return (error: AxiosError, setErr: (err: string) => void) => {
    let message = "An unknown error occurred";

    if (error && (error as AxiosError).isAxiosError) {
      const axiosError = error as AxiosError<{ message: string }>;
      message = axiosError.response?.data?.message || axiosError.message;
    }

    toast.error(message);
    setErr(message);
  };
};
