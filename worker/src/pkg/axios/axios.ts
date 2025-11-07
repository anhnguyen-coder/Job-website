import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_BASE_ENDPOINT_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("currenWorker");
      localStorage.removeItem("workerToken");

      toast.error("Your session has expired. Please sign in again.");

      setTimeout(() => {
        window.location.href = "/signin";
      }, 1000);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
