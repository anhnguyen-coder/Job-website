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
import axiosInstance from "../../services/axios";
import { GET, POST } from "../../services/customer/auth/apis";
import type { AxiosError } from "axios";

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [err, setErr] = useState("");

  const navigate = useNavigate();

  const signin = async (input: customerSigninInput) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(POST.SIGNIN, input);
      if (response.status === 200) {
        setIsAuthenticated(true);
        navigate("/customer/dashboard");
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

  const profile = useCallback(async () => {
    setLoading(true);
    try {
      if (localStorage.getItem("currenCustomer")) {
        setIsAuthenticated(true);
        return;
      }

      const res = await axiosInstance.get(GET.PROFILE);
      if (res.data.success) {
        setUser(res.data.data);
        localStorage.setItem("currenCustomer", JSON.stringify(res.data.data));
        setIsAuthenticated(true);
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      // console.log(error);
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
      navigate("/customer/signin");
    } catch (error) {
      console.log(error);
    }
  };

  const resetPassword = async (input: resetPasswordInput) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(POST.RESET_PASSWORD, input);
      if (response.data.success) {
        navigate("/customer/signin");
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
        navigate("/customer/signin");
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
