import { useCustomerAuth } from "@/contexts/customer";
import { useState } from "react";

interface customerSignInInput {
  email: string;
  password: string;
}
const useCustomerLogin = () => {
  const customerAuth = useCustomerAuth();
  const [input, setInput] = useState<customerSignInInput>({
    email: "",
    password: "",
  });

  const handleSignIn = async () => {
    await customerAuth.signin(input);
  };

  return {
    input,
    setInput,
    handleSignIn,
    err: customerAuth.err,
  };
};

export default useCustomerLogin;
