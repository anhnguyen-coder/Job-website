import { GET, PUT } from "@/apis/customer/auth";
import axiosInstance from "@/pkg/axios/axiosInstance";
import { useErrorHandler } from "@/pkg/helpers/errorHandler";

import type { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const useHook = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isExist, setIsExist] = useState<boolean>(false);
  const [err, setErr] = useState<string>("");
  const handleError = useErrorHandler();

  const navigate = useNavigate();

  const handleFindByEmail = async () => {
    setLoading(true);

    try {
      const res = await axiosInstance.get(
        `${GET.FIND_BY_EMAIL}?email=${email}`
      );

      if (res.data.success) {
        setIsExist(true);
      }
    } catch (error) {
      console.log(error);
      handleError(error as AxiosError, setErr);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      const body = {
        email: email,
        password: password,
      };
      const res = await axiosInstance.put(PUT.RESET_PASSWORD, body);

      if (res.data.success) {
        navigate("/customer/signin");
      }
    } catch (error) {
      handleError(error as AxiosError, setErr);
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    loading,
    setLoading,
    isExist,
    err,
    password,
    setPassword,
    handleFindByEmail,
    handleResetPassword,
  };
};

export default useHook;
