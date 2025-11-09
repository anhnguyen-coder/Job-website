import { useErrorHandler } from "@/pkg/helper/errHandler";
import type { UserInterface } from "@/pkg/interfaces/user.type";
import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type {
  resetPasswordInput,
  WorkerAuthContextType,
  WorkerSigninInput,
  WorkerSignUpInput,
} from "./type";
import axiosInstance from "@/pkg/axios/axios";
import { GET_API, POST_API, PUT_API } from "@/api/auth";
import type { AxiosError } from "axios";
import { toast } from "react-toastify";
import { WorkerAuthContext } from "./context";

export const WorkerProvider = ({ children }: { children: ReactNode }) => {
  const [worker, setWorker] = useState<UserInterface | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem("workerToken")
  );
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const handleError = useErrorHandler();

  const signin = async (input: WorkerSigninInput) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(POST_API.SIGN_IN, input);
      if (response.data.success) {
        localStorage.setItem("workerToken", response.data.data);
        setIsAuthenticated(true);
        navigate("/dashboard");
      }
    } catch (error) {
      handleError(error as AxiosError, setErr);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await axiosInstance.post(POST_API.SIGN_OUT);
    } catch (error) {
      handleError(error as AxiosError, setErr);
    } finally {
      setIsAuthenticated(false);
      localStorage.removeItem("workerToken");
      localStorage.removeItem("currentWorker");
      setWorker(null);
      navigate("/signin");
    }
  };

  const signUp = async (input: WorkerSignUpInput) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post(POST_API.SIGN_UP, input);

      if (res.data.success) {
        toast.success("Signed up successfully!");
        navigate("/signin");
      }
    } catch (error) {
      handleError(error as AxiosError, setErr);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (input: resetPasswordInput) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(PUT_API.RESET_PASSWORD, input);
      if (response.data.success) {
        toast.success("Password reset successfully!");
        navigate("/signin");
      }
      setLoading(false);
    } catch (error) {
      handleError(error as AxiosError, setErr);
    } finally {
      setLoading(false);
    }
  };

  const profile = async () => {
    try {
      const storedUser = localStorage.getItem("currentWorker");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setWorker(parsedUser);
        return;
      }

      const response = await axiosInstance.get(GET_API.PROFILE);
      if (response.data.success) {
        const userData = response.data.data;
        localStorage.setItem("currentWorker", JSON.stringify(userData));
        setWorker(userData);
      }
    } catch (error) {
      handleError(error as AxiosError, setErr);
    }
  };

  const value: WorkerAuthContextType = {
    worker,
    loading,
    isAuthenticated,
    err,
    setWorker,
    setLoading,
    setIsAuthenticated,
    signin,
    signOut,
    signUp,
    resetPassword,
    profile,
  };

  return (
    <WorkerAuthContext.Provider value={value}>
      {children}
    </WorkerAuthContext.Provider>
  );
};
