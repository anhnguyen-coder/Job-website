import { SignUpForm } from "@/components/customer/form/signup.form";
import type React from "react";
import useSignUpHook from "./hook";
import { HeaderAuth } from "@/components/base/headerAuth";

export const SignUp: React.FC = () => {
  const { input, setInput, handleSignUp, err } = useSignUpHook();
  return (
    <div className="w-full flex flex-col items-center justify-center p-8">
      <HeaderAuth/>

      {/* form */}
      <SignUpForm
        input={input}
        setInput={setInput}
        handleSignUp={handleSignUp}
        err={err}
      />
    </div>
  );
};
