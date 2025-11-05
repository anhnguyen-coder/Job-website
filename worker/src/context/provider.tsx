import { useErrorHandler } from "@/pkg/helper/errHandler";
import type { UserInterface } from "@/pkg/interfaces/user.type";
import { useCallback, useEffect, useState, type ReactNode } from "react";
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const handleError = useErrorHandler();

  const signin = async (input: WorkerSigninInput) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(POST_API.SIGN_IN, input);
      if (response.data.success) {
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
      setWorker(null);
      navigate("/signin");
    }
  };

  const validateToken = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(GET_API.VALIDATE_TOKEN);
      if (res.data.success) {
        setIsAuthenticated(true);
        setWorker(res.data.admin);
      } else {
        setIsAuthenticated(false);
        setWorker(null);
      }
    } catch (error) {
      setIsAuthenticated(false);
      setWorker(null);
      handleError(error as AxiosError, setErr);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, [handleError]);

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
        toast.success("Reseted password successfully!");
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
    setLoading(true);
    try {
      const response = await axiosInstance.get(GET_API.PROFILE);
      if (response.data.success) {
        setWorker(response.data.data);
      }
    } catch (error) {
      handleError(error as AxiosError, setErr);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialized) validateToken();
    else setInitialized(true);
  }, [validateToken, initialized]);

  const value: WorkerAuthContextType = {
    worker,
    loading,
    isAuthenticated,
    initialized,
    err,
    setWorker,
    setLoading,
    setIsAuthenticated,
    signin,
    signOut,
    validateToken,
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
