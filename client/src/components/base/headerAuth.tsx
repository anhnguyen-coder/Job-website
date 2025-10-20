import appLogo from "@/assets/images/logo.png";

export function HeaderAuth() {
  return (
    <>
      {/* header */}
      <header>
        <div className="flex items-center justify-center mb-4">
          <img
            src={appLogo}
            alt="logo"
            className="w-[100px] h-[100px] rounded-lg"
            style={{ objectFit: "cover" }}
          />
        </div>

        <div>
          <h3 className="text-4xl font-semibold mb-2">Job Ting Ting</h3>
          <p className="text-sm text-gray-500">Sign in to your account</p>
        </div>
      </header>
    </>
  );
}
