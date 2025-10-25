import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

const errhandler = (error: AxiosError, setErr: (err: string) => void) => {
  const navigate = useNavigate();
  let message = "An unknown error occurred";

  if (error && (error as AxiosError).isAxiosError) {
    if (error.status === 401) {
      navigate("/customer/signin");
    }

    const axiosError = error as AxiosError<{ message: string }>;
    message = axiosError.response?.data?.message || axiosError.message;
  }

  setErr(message);
};

export { errhandler };
