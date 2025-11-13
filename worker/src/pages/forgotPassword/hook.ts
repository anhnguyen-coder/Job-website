import { GET_API, PUT_API } from "@/api/auth";
import axiosInstance from "@/pkg/axios/axios";
import { useErrorHandler } from "@/pkg/helper/errHandler";
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
        `${GET_API.FIND_BY_EMAIL}?email=${email}`
      );

      if (res.data.success) {
        setIsExist(true);
      }
    } catch (error) {
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
      const res = await axiosInstance.put(PUT_API.RESET_PASSWORD, body);

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
