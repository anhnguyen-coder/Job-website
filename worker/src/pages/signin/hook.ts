import { useWorkerAuth } from "@/context/context";
import type { WorkerSigninInput } from "@/context/type";
import { useState } from "react";

const useHook = () => {
  const workerAuth = useWorkerAuth();
  const [input, setInput] = useState<WorkerSigninInput>({
    email: "",
    password: "",
  });

  const handleSignIn = async () => {
    console.log(input);
    await workerAuth.signin(input);
  };

  return {
    input,
    setInput,
    handleSignIn,
    err: workerAuth.err,
  };
};

export default useHook;
