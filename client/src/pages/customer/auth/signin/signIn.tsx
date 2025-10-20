import { SignInForm } from "@/components/customer/form/signin.form";
import useCustomerLogin from "./hook";
import { HeaderAuth } from "@/components/base/headerAuth";

const SignIn = () => {
  const { input, setInput, err, handleSignIn } = useCustomerLogin();
  return (
    <div className="w-full flex flex-col items-center justify-center p-8">
      <HeaderAuth/>

      {/* form */}
      <SignInForm
        input={input}
        setInput={setInput}
        handleSignIn={handleSignIn}
        err={err}
      />
    </div>
  );
};

export default SignIn;
