import appLogo from "@/assets/images/logo.png";

export function HeaderAuth() {
  return (
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
  );
}
