import { useCustomerAuth, type customerSignupInput } from "@/contexts/customer";
import { useState } from "react";

const useSignUpHook = () => {
  const customerAuth = useCustomerAuth();

  const [input, setInput] = useState<customerSignupInput>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSignUp = () => {
    return customerAuth.signUp(input);
  };

  return {
    loading: customerAuth.loading,
    input,
    setInput,
    handleSignUp: handleSignUp,
    err: customerAuth.err,
  };
};

export default useSignUpHook;