import type { AxiosError } from "axios";

const errhandler = (error: AxiosError, setErr: (err: string) => void) => {
  let message = "An unknown error occurred";

  console.log(error);
  if (error && (error as AxiosError).isAxiosError) {
    const axiosError = error as AxiosError<{ message: string }>;
    message = axiosError.response?.data?.message || axiosError.message;
  }

  setErr(message);
};

export { errhandler };
