import type { AxiosError } from "axios";
import { toast } from "react-toastify";

export const useErrorHandler = () => {
  return (error: AxiosError, setErr: (err: string) => void) => {
    let message = "An unknown error occurred";

    if (error && (error as AxiosError).isAxiosError) {
      const axiosError = error as AxiosError<{ message: string }>;
      message = axiosError.response?.data?.message || axiosError.message;
      if (error.status !== 401) {
        toast.error(message);
        setErr(message);
      }
    }
  };
};
