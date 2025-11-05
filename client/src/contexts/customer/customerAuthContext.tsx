import { useCallback, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { CustomerAuthContext } from "./context";
import type {
  CustomerAuthContextType,
  customerSigninInput,
  customerSignupInput,
  resetPasswordInput,
  User,
} from "./types";

import type { AxiosError } from "axios";
import axiosInstance from "@/pkg/axios/axiosInstance";
import { GET, POST, PUT } from "@/apis/customer/auth/apis";
import { useErrorHandler } from "@/pkg/helpers/errorHandler";

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [err, setErr] = useState("");
  const handleError = useErrorHandler();

  const navigate = useNavigate();

  const signin = async (input: customerSigninInput) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(POST.SIGNIN, input);
      if (response.status === 200) {
        setIsAuthenticated(true);
        navigate("/dashboard");
      }
      setLoading(false);
    } catch (error) {
      handleError(error as AxiosError, setErr);
    } finally {
      setLoading(false);
    }
  };

  const validateToken = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(GET.VALIDATE_TOKEN);

      if (res.data.success) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        navigate("/signin");
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      handleError(error as AxiosError, setErr);
    } finally {
      setLoading(false);
    }
  }, []);

  const profile = useCallback(async () => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem("currenCustomer");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        return;
      }

      const res = await axiosInstance.get(GET.PROFILE);
      if (res.data.success) {
        setUser(res.data.data);
        localStorage.setItem("currenCustomer", JSON.stringify(res.data.data));
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      handleError(error as AxiosError, setErr);
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = async () => {
    try {
      await axiosInstance.post(POST.SIGNOUT);
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem("currenCustomer");
      navigate("/signin");
    } catch (error) {
      handleError(error as AxiosError, setErr);
    }
  };

  const resetPassword = async (input: resetPasswordInput) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(PUT.RESET_PASSWORD, input);
      if (response.data.success) {
        navigate("/signin");
      }
      setLoading(false);
    } catch (errorny) {
      let message = "An unknown error occurred";

      if (errorny && (errorny as AxiosError).isAxiosError) {
        const axiosError = errorny as AxiosError<{ message: string }>;
        message = axiosError.response?.data?.message || axiosError.message;
      }

      setErr(message);
      setLoading(false);
    }
  };

  const signUp = async (input: customerSignupInput) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(POST.SIGNUP, input);
      if (response.data.success) {
        navigate("/signin");
      }
      setLoading(false);
    } catch (error) {
      handleError(error as AxiosError, setErr);
    }
  };

  const value: CustomerAuthContextType = {
    user,
    loading,
    isAuthenticated,
    err: err,
    setUser,
    setLoading,
    setIsAuthenticated,

    signin: signin,
    profile: profile,
    signOut: signOut,
    signUp: signUp,
    resetPassword: resetPassword,
    validateToken: validateToken,
  };

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
}
