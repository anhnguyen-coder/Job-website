import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { CustomerAuthContext } from "./context";
import type {
  CustomerAuthContextType,
  customerSigninInput,
  customerSignupInput,
  resetPasswordInput,
} from "./types";

import type { AxiosError } from "axios";
import axiosInstance from "@/pkg/axios/axiosInstance";
import { GET, POST, PUT } from "@/apis/customer/auth";
import { useErrorHandler } from "@/pkg/helpers/errorHandler";
import type { UserInterface } from "@/pkg/types/interfaces/user.type";

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInterface | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem("customerToken")
  );
  const [err, setErr] = useState("");
  const handleError = useErrorHandler();

  const navigate = useNavigate();

  const signin = async (input: customerSigninInput) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(POST.SIGNIN, input);
      if (response.data.success) {
        localStorage.setItem("customerToken", response.data.data);
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

  const profile = useCallback(async () => {
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
      handleError(error as AxiosError, setErr);
    }
  }, []);

  const signOut = async () => {
    try {
      await axiosInstance.post(POST.SIGNOUT);
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem("currenCustomer");
      localStorage.removeItem("customerToken");
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
      handleError(errorny as AxiosError, setErr);
    } finally {
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
  };

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
}
