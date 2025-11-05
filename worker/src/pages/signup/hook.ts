import { useWorkerAuth } from "@/context/context";
import type { WorkerSignUpInput } from "@/context/type";
import { useState } from "react";

const useSignUpHook = () => {
  const Auth = useWorkerAuth();

  const [input, setInput] = useState<WorkerSignUpInput>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSignUp = () => {
    return Auth.signUp(input);
  };

  return {
    loading: Auth.loading,
    input,
    setInput,
    handleSignUp: handleSignUp,
    err: Auth.err,
  };
};

export default useSignUpHook;
