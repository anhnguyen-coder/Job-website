import { HeaderAuth } from "@/components/base/headerAuth";
import { FindWithEmailCustomer } from "@/components/customer/findByEmail";
import type React from "react";
import useHook from "./hook";
import { LoadingOverlay } from "@/components/base/loading";

const ForgotPasswordPage: React.FC = () => {
  const {
    email,
    setEmail,
    isExist,
    loading,
    err,
    handleFindByEmail,
    password,
    setPassword,
    handleResetPassword,
  } = useHook();

  if (loading) return <LoadingOverlay />;
  return (
    <div>
      <HeaderAuth />

      <FindWithEmailCustomer
        email={email}
        setEmail={setEmail}
        err={err}
        handleFindByEmail={handleFindByEmail}
        password={password}
        setPassword={setPassword}
        handleResetPassword={handleResetPassword}
        isExist={isExist}
      />
    </div>
  );
};

export default ForgotPasswordPage;
