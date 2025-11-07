import appLogo from "@/assets/logo.png";
import useHook from "./hook";
import { FindWithEmailWorker } from "@/components/auth/findByEmail";
import { LoadingOverlay } from "@/components/base/loading";

function Page() {
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
      <header className="flex flex-col items-center text-center mb-8">
        {/* Logo */}
        <div className="flex items-center justify-center mb-5">
          <img
            src={appLogo}
            alt="Job Ting Ting logo"
            className="w-20 h-20 rounded-xl shadow-md transition-transform duration-300 hover:scale-105"
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* Title & Subtitle */}
        <div>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 tracking-tight">
            Job Ting Ting
          </h3>
          <p className="text-sm md:text-base text-gray-500">
            Sign in to your account
          </p>
        </div>
      </header>

      <FindWithEmailWorker
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
}

export default Page;
