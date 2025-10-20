import { SignInForm } from "@/components/customer/form/signin.form";
import useCustomerLogin from "./hook";

const SignIn = () => {
  const { input, setInput, err, handleSignIn } = useCustomerLogin();
  return (
    <div className="w-full flex flex-col items-center justify-center p-8">
      {/* header */}
      <header>
        {/* logo */}
        <div>
          <h3 className="text-4xl font-semibold mb-2">Job Ting Ting</h3>
          <p className="text-sm text-gray-500">Sign in to your account</p>
        </div>
      </header>

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
